import { TEST, ADD_FOLDER, REMOVE_FOLDER } from '../actions';
import { combineReducers } from 'redux';

const switches = (state = { readingFolder: false }, action) => {
  switch (action.type) {
    case TEST:
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

const initialFoldersMap = new Map();

function folders (state = initialFoldersMap, action) {
  const newState = new Map(state);

  console.log(`action`, action);

  switch (action.type) {
    case ADD_FOLDER:
      newState.set(action.path, {
        path: action.path,
        items: []
      });
      return newState;
      break;

    case REMOVE_FOLDER:
      newState.delete(action.path);
      return newState;
      break;

    default:
      return state;
      break;
  }
}

export default combineReducers({
  switches,
  folders
});
