import ReactDOM from 'react-dom';
import React from 'react';
import { createStore, applyMiddleware, compose, Store } from 'redux';
import { Provider } from 'react-redux';

import { reducer, State } from './reducer';
import * as actions from './actions';

import { DataStore, TeamChange } from './DataStore';
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
    alert('なんか、壊れてるみたい。更新してみたら？');
  });

// Trigger initial data fetch

dataStore.getTeams().then(teams => {
  store.dispatch(actions.loadTeams(teams));
});

// Watch for changes

dataStore.changes.on('team', (change: TeamChange) => {
  if (change.deleted) {
    store.dispatch(actions.deleteTeam(change.team.id));
  } else {
    store.dispatch(actions.updateTeam(change.team));
  }
});

//
// Render the root component
//

ReactDOM.render(
  <Provider store={store}>
    <App dataStore={dataStore} />
  </Provider>,
  document.getElementById('container')
);
