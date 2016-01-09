import {
  ADD_ANIME_FOLDER,
  UPDATE_ANIME_FOLDER,
  TEST
} from 'actions';
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

  switch (action.type) {
    case ADD_ANIME_FOLDER:
      newState.set(action.animeFolder.id, action.animeFolder);
      return newState;
      break;

    case UPDATE_ANIME_FOLDER:
      newState.set(action.animeFolder.id, action.animeFolder);
      console.log(`AFTER UPDATE_ANIME_FOLDER STATE`, newState);
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
