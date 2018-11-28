import PouchDB from 'pouchdb';

import { Team, TeamUpdate, NewTeam } from './Team';
import { generateUniqueTimestampId, stripFields } from './utils';

PouchDB.plugin(require('pouchdb-upsert'));
PouchDB.plugin(require('pouch-resolve-conflicts'));

type DataStoreOptions = PouchDB.Configuration.LocalDatabaseConfiguration;

interface TeamContent {
  name: string;
  color: string;
  question: number;
  answers: Array<string>;
  startTime: number;
  endTime: number | null;
}
type ExistingTeamDoc = PouchDB.Core.ExistingDocument<TeamContent>;
type TeamDoc = PouchDB.Core.Document<TeamContent>;

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
  /*
  async getTeams(): Promise<Array<Team>> {
  }
  */
  async deleteTeam(id: string): Promise<void> {
    await stubbornDelete(TEAM_PREFIX + id, this.db!);
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
