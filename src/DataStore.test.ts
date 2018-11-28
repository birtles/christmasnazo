import PouchDB from 'pouchdb';

import { DataStore, TeamChange } from './DataStore';
import { NewTeam } from './Team';

PouchDB.plugin(require('pouchdb-adapter-memory'));

describe('DataStore', () => {
  let dataStore: DataStore;
  let testRemote: PouchDB.Database;

  const typicalNewTeam: NewTeam = {
    name: 'Team',
    color: 'blue',
    question: 0,
    answers: [],
    startTime: new Date(),
    endTime: null,
  };

  beforeEach(() => {
    dataStore = new DataStore({ adapter: 'memory' });

    // A separate remote we use for reading back documents directly, injecting
    // conflicting documents etc.
    testRemote = new PouchDB('cards_remote', { adapter: 'memory' });
  });

  afterEach(() => Promise.all([dataStore.destroy(), testRemote.destroy()]));

  it('returns a newly-added team', async () => {
    const putTeam = await dataStore.putTeam(typicalNewTeam);
    const gotTeam = await dataStore.getTeam(putTeam.id);

    expect(gotTeam).toEqual(putTeam);
  });

  it('deletes a team', async () => {
    const putTeam = await dataStore.putTeam(typicalNewTeam);
    await dataStore.deleteTeam(putTeam.id);
    await expect(dataStore.getTeam(putTeam.id)).rejects.toMatchObject({
      status: 404,
      name: 'not_found',
      message: 'missing',
      reason: 'deleted',
    });
  });

  it('updates a team', async () => {
    const putTeam = await dataStore.putTeam(typicalNewTeam);
    const updatedTeam = await dataStore.updateTeam({
      id: putTeam.id,
      name: 'Updated',
    });
    expect(updatedTeam).toMatchObject({
      id: putTeam.id,
      name: 'Updated',
    });
    const gotTeam = await dataStore.getTeam(putTeam.id);
    expect(gotTeam).toEqual(updatedTeam);
  });

  it('returns all teams', async () => {
    const teamA = await dataStore.putTeam({
      ...typicalNewTeam,
      name: 'Team A',
    });
    const teamB = await dataStore.putTeam({
      ...typicalNewTeam,
      name: 'Team B',
    });
    const teamC = await dataStore.putTeam({
      ...typicalNewTeam,
      name: 'Team C',
    });

    const teams = await dataStore.getTeams();
    expect(teams).toEqual([teamA, teamB, teamC]);
  });

  it('reports added teams', async () => {
    const changesPromise = waitForChangeEvents<TeamChange>(
      dataStore,
      'team',
      1
    );

    const putTeam = await dataStore.putTeam(typicalNewTeam);

    const changes = await changesPromise;
    expect(changes[0].team).toMatchObject(putTeam);
  });

  it('reports deleted teams', async () => {
    const changesPromise = waitForChangeEvents<TeamChange>(
      dataStore,
      'team',
      2
    );
    const putTeam = await dataStore.putTeam(typicalNewTeam);

    await dataStore.deleteTeam(putTeam.id);

    const changes = await changesPromise;
    expect(changes[1].team.id).toBe(putTeam.id);
    expect(changes[1].deleted).toBeTruthy();
  });

  it('reports changes to teams', async () => {
    const changesPromise = waitForChangeEvents<TeamChange>(
      dataStore,
      'team',
      2
    );
    const putTeam = await dataStore.putTeam(typicalNewTeam);

    await dataStore.putTeam({ ...putTeam, name: 'Updated' });

    const changes = await changesPromise;
    expect(changes[1].team.name).toBe('Updated');
  });

  // Syncs data
  // Sets the game status
  // Allows deleting all teams
});

function waitForChangeEvents<EventType>(
  dataStore: DataStore,
  type: string,
  num: number
): Promise<Array<EventType>> {
  const events: EventType[] = [];

  let resolver: (e: typeof events) => void;
  const promise = new Promise<typeof events>(resolve => {
    resolver = resolve;
  });

  let recordedChanges = 0;
  dataStore.changes.on(type, change => {
    events.push(change);
    if (++recordedChanges === num) {
      resolver(events);
    }
  });

  return promise;
}
