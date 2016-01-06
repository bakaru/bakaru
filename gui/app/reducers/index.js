import { combineReducers } from 'redux';

const app = (state = { readingFolder: false }, action) => {
  return state;
};

export default combineReducers({
  app
});
