import { combineReducers } from 'redux';
import app from './appReducer';

const appReducer = combineReducers({
  app,
});

/*   Clears the store state    */
const rootReducer = (state, action) => {
  if (action.type === 'CLEAR_STORE') {
    // Leave permanent reducers here
    return appReducer({}, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
