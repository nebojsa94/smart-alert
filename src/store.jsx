import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

// import the root reducer
import rootReducer from './reducers/index';

// create an object for the default data

const defaultState = {};

// Redux developer tools enchancer
const reduxDevToolsEnchancer = window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION__();

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);

const store = createStoreWithMiddleware(rootReducer, defaultState, reduxDevToolsEnchancer);

if (module.hot) {
  module.hot.accept('./reducers/', () => {
    // eslint-disable-line global-require
    const nextRootReducer = require('./reducers/index').default;
    store.replaceReducer(nextRootReducer);
  });
}

export default store;

