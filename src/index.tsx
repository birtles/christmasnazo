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

//
// Render the root component
//

ReactDOM.render(
  <Provider store={store}>
    <App dataStore={dataStore} />
  </Provider>,
  document.getElementById('container')
);
