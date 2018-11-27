import PouchDB from 'pouchdb';

import DataStore from './DataStore';
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
    const gotTeam = await dataStore.getTeam(putTeam.id!);

    expect(gotTeam).toEqual(putTeam);
  });
});
