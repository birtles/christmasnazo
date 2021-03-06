import ReactDOM from 'react-dom';
import React from 'react';
import { createStore, applyMiddleware, compose, Store } from 'redux';
import { Provider } from 'react-redux';

import { reducer, State } from './reducer';
import * as actions from './actions';

import { DataStore, GameStatusChange, TeamChange } from './DataStore';
import { App } from './components/App';

//
// Redux store
//

let store: Store<State, actions.Action>;
if (process.env.NODE_ENV === 'development') {
  const { createLogger } = require('redux-logger');
  const loggerMiddleware = createLogger();
  const composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(loggerMiddleware))
  );
} else {
  store = createStore(reducer);
}

//
// Local data store
//

const dataStore = new DataStore();
dataStore
  .setSyncServer(
    'https://b62bf565-d36c-45ce-a12d-fc3bd31a256b-bluemix.cloudant.com/christmasnazo',
    {
      username: 'oldindsconlyinlyingourna',
      password: '9a41c6611e776aa6f341973423d4817cc39b59c4',
    }
  )
  .catch(() => {
    store.dispatch(actions.error('サーバーがなくなちゃったよー'));
  });

// Trigger initial data fetch

dataStore.getTeams().then(teams => {
  store.dispatch(actions.loadTeams(teams));
});
dataStore.getGameStatus().then(status => {
  store.dispatch(actions.updateGameStatus(status));
});

// Watch for changes

dataStore.changes.on('team', (change: TeamChange) => {
  if (change.deleted) {
    store.dispatch(actions.deleteTeam(change.team.id));
  } else {
    store.dispatch(actions.updateTeam(change.team));
  }
});
dataStore.changes.on('status', (change: GameStatusChange) => {
  store.dispatch(actions.updateGameStatus(change.status));
});

// Get app mode

const isManager = location.pathname === '/manage';

//
// Render the root component
//

ReactDOM.render(
  <Provider store={store}>
    <App dataStore={dataStore} isManager={isManager}/>
  </Provider>,
  document.getElementById('container')
);
