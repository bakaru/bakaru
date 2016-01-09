import folders from './folders';
import { combineReducers } from 'redux';

const switches = (state = { readingFolder: false }, action) => {
  switch (action.type) {
    case 'TEST':
      return {
        ...state,
        readingFolder: true
      };
      break;

    default:
      return state;
      break;
  }
};

export default combineReducers({
  switches,
  folders
});
