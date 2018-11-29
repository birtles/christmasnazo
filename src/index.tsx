import ReactDOM from 'react-dom';
import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';

import reducer from './reducer';

import DataStore from './DataStore';
import { App } from './components/App';

//
// Redux store
//

let store;
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
// Local data stores
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

//
// Render the root component
//

ReactDOM.render(
  <Provider store={store}>
    <App dataStore={dataStore} />
  </Provider>,
  document.getElementById('container')
);
