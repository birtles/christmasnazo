import PouchDB from 'pouchdb';
import EventEmitter from 'event-emitter';

import { Team, TeamUpdate, NewTeam } from './Team';
import { generateUniqueTimestampId, stripFields } from './utils';

PouchDB.plugin(require('pouchdb-upsert'));
PouchDB.plugin(require('pouch-resolve-conflicts'));

type DataStoreOptions = PouchDB.Configuration.LocalDatabaseConfiguration;

interface SyncOptions {
  onError?: (err: PouchDB.Core.Error) => void;
  username?: string;
  password?: string;
  batchSize?: number;
}

interface TeamContent {
  name: string;
  color: string;
  question: number;
  answers: Array<string>;
  startTime: number;
  endTime: number | null;
}
type TeamDoc = PouchDB.Core.Document<TeamContent>;
type ExistingTeamDoc = PouchDB.Core.ExistingDocument<TeamContent>;
type ExistingTeamDocWithChanges = PouchDB.Core.ExistingDocument<
  TeamContent & PouchDB.Core.ChangesMeta
>;

export interface TeamChange {
  team: Team;
  deleted?: boolean;
}

const isTeamChangeDoc = (
  changeDoc:
    | PouchDB.Core.ExistingDocument<any & PouchDB.Core.ChangesMeta>
    | undefined
): changeDoc is ExistingTeamDocWithChanges => {
  return changeDoc && changeDoc._id.startsWith(TEAM_PREFIX);
};

const TEAM_PREFIX = 'team-';

const parseTeam = (team: ExistingTeamDoc | TeamDoc): Team => {
  const result: Team = {
    ...stripFields(team as ExistingTeamDoc, ['_id', '_rev']),
    id: team._id.substr(TEAM_PREFIX.length),
    startTime: new Date(team.startTime),
    endTime: team.endTime ? new Date(team.endTime) : null,
  };

  return result;
};

export class DataStore {
  db?: PouchDB.Database;
  initDone: Promise<PouchDB.Core.DatabaseInfo>;
  remoteDb?: PouchDB.Database;
  remoteSync?: PouchDB.Replication.Sync<{}>;
  changesEmitter?: EventEmitter.Emitter;

  constructor(options?: DataStoreOptions) {
    const dbOptions = options || {};
    this.db = new PouchDB('quiz', options);

    this.initDone = this.db.info();
  }

  async putTeam(team: NewTeam): Promise<Team> {
    const teamToPut: TeamDoc = {
      ...team,
      _id: TEAM_PREFIX + generateUniqueTimestampId(),
      startTime: team.startTime.getTime(),
      endTime: team.endTime ? team.endTime.getTime() : null,
    };

    const teamDoc: ExistingTeamDoc = await (async function tryToPutNewTeam(
      teamDoc,
      db
    ): Promise<ExistingTeamDoc> {
      let result;
      try {
        result = await db.put(teamDoc);
      } catch (err) {
        if (err.status !== 409) {
          throw err;
        }
        teamDoc._id = TEAM_PREFIX + generateUniqueTimestampId();
        return tryToPutNewTeam(teamDoc, db);
      }

      return {
        ...teamToPut,
        _rev: result.rev,
      };
    })(teamToPut, this.db!);

    return parseTeam(teamDoc);
  }

  async updateTeam(team: TeamUpdate): Promise<Team> {
    let teamDoc: ExistingTeamDoc | undefined;
    let missing = false;

    let teamUpdate: Partial<ExistingTeamDoc> = {
      ...stripFields(team, ['id', 'startTime', 'endTime']),
    };
    if (team.startTime) {
      teamUpdate.startTime = team.startTime.getTime();
    }
    if (team.endTime) {
      teamUpdate.endTime = team.endTime.getTime();
    }

    await this.db!.upsert<TeamContent>(TEAM_PREFIX + team.id, doc => {
      // Doc was not found -- must have been deleted
      if (!doc.hasOwnProperty('_id')) {
        missing = true;
        return false;
      }

      teamDoc = {
        ...(doc as ExistingTeamDoc),
        ...teamUpdate,
      };

      // Check we actually have something to update.
      // We need to do this after filling-in teamDoc.
      if (!Object.keys(teamUpdate).length) {
        return false;
      }

      return teamDoc;
    });

    if (missing || !teamDoc) {
      const err: Error & { status?: number } = new Error('missing');
      err.status = 404;
      err.name = 'not_found';
      throw err;
    }

    return parseTeam(teamDoc);
  }

  async getTeam(id: string): Promise<Team> {
    return parseTeam(await this.db!.get<TeamContent>(TEAM_PREFIX + id));
  }

  async getTeams(): Promise<Array<Team>> {
    const teamDocs = await this.db!.allDocs<TeamContent>({
      include_docs: true,
      startkey: TEAM_PREFIX,
      endkey: TEAM_PREFIX + '\ufff0',
    });

    return teamDocs.rows
      .filter(row => !!row.doc)
      .map(row => parseTeam(row.doc!));
  }

  async deleteTeam(id: string): Promise<void> {
    await stubbornDelete(TEAM_PREFIX + id, this.db!);
  }

  get changes() {
    if (this.changesEmitter) {
      return this.changesEmitter;
    }

    this.changesEmitter = EventEmitter(null);

    const emit = this.changesEmitter!.emit.bind(this.changesEmitter!);
    const dbChanges = this.db!.changes({
      since: 'now',
      live: true,
      include_docs: true,
    });

    dbChanges.on('change', async change => {
      console.assert(change.changes && change.doc, 'Unexpected changes event');

      if (isTeamChangeDoc(change.doc)) {
        const result: TeamChange = {
          team: parseTeam(
            stripFields(change.doc, ['_conflicts', '_deleted', '_attachments'])
          ),
        };
        if (change.deleted) {
          result.deleted = true;
        }
        emit('team', result);
      }
    });

    return this.changesEmitter;
  }

  async setSyncServer(
    syncServer?: string | PouchDB.Database | null,
    options?: SyncOptions
  ) {
    // Setup an alias for error handling
    const reportErrorAsync = (err: Error) => {
      if (options && options.onError) {
        setImmediate(() => {
          options.onError!(err);
        });
      }
    };

    if (this.remoteSync) {
      this.remoteSync.cancel();
      this.remoteSync = undefined;
    }

    this.remoteDb = undefined;

    if (!syncServer) {
      return;
    }

    let dbOptions;
    if (options && options.username) {
      dbOptions = {
        auth: {
          username: options.username,
          password: options.password,
        },
      };
    }
    this.remoteDb =
      typeof syncServer === 'string'
        ? new PouchDB(syncServer, dbOptions)
        : syncServer;

    const originalDbName = this.remoteDb.name;

    // Initial sync
    let localUpdateSeq: number | undefined;
    let remoteUpdateSeq: number | undefined;
    try {
      const localInfo = await this.db!.info();
      localUpdateSeq = parseInt(<string>localInfo.update_seq, 10);

      const remoteInfo = await this.remoteDb!.info();
      remoteUpdateSeq = parseInt(<string>remoteInfo.update_seq, 10);
    } catch (err) {
      // Skip error if the remote DB has already been changed.
      if (!this.remoteDb || originalDbName !== this.remoteDb.name) {
        return;
      }
      this.remoteDb = undefined;
      reportErrorAsync(err);
      throw err;
    }

    const pushPullOpts =
      options && options.batchSize
        ? { batch_size: options.batchSize }
        : undefined;

    this.remoteSync = this.db!.sync(this.remoteDb!, {
      live: true,
      retry: true,
      pull: pushPullOpts,
      push: pushPullOpts,
    });

    // Register change callback which is where we resolve conflicts.
    const changeCallback = (info: PouchDB.Replication.SyncResult<{}>) => {
      // Skip events if they are from an old remote DB
      if (!this.remoteDb || originalDbName !== this.remoteDb.name) {
        return;
      }

      // Resolve any conflicts
      if (info.direction === 'pull') {
        this.onSyncChange(info.change.docs);
      }
    };
    this.remoteSync.on('change', changeCallback);

    // Register error callback.
    if (options && options.onError) {
      const errorCallback = (info: PouchDB.Replication.SyncResult<{}>) => {
        // Skip events if they are from an old remote DB
        if (!this.remoteDb || originalDbName !== this.remoteDb.name) {
          return;
        }

        options!.onError!((info as unknown) as Error);
      };
      this.remoteSync.on('error', errorCallback);
    }

    await this.remoteDb;
  }

  async onSyncChange(docs: PouchDB.Core.ExistingDocument<{}>[]) {
    // Resolve any conflicts
    for (const doc of docs) {
      if (isTeamChangeDoc(doc)) {
        if (doc._deleted) {
          return;
        }

        const result = await this.db!.get<TeamContent>(doc._id, {
          conflicts: true,
        });
        if (!result._conflicts) {
          return;
        }

        await this.db!.resolveConflicts(result, (a, b) => {
          if (
            b.question > a.question ||
            b.startTime > a.startTime ||
            (b.endTime && !a.endTime) ||
            (b.endTime && a.endTime && b.endTime > a.endTime)
          ) {
            return b;
          }

          return a;
        });
      }
    }
  }

  // Intended for unit testing only

  async destroy(): Promise<void> {
    if (!this.db) {
      return;
    }

    const db = this.db;
    this.db = undefined;
    return db.destroy();
  }

  getSyncServer() {
    return this.remoteDb;
  }
}

/**
 * Keep trying to delete a document if conflicts are encountered.
 */
async function stubbornDelete(id: string, db: PouchDB.Database): Promise<void> {
  let doc;
  try {
    doc = await db.get(id);
  } catch (err) {
    // If the document is missing then just return
    if (err.status === 404) {
      return;
    }
    throw err;
  }

  try {
    await db.remove(doc);
    return;
  } catch (err) {
    if (err.status !== 409) {
      throw err;
    }
    // If there is a conflict, just keep trying
    doc = await db.get(id);
    return stubbornDelete(doc._id, db);
  }
}

export default DataStore;
