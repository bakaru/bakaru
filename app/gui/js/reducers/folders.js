import {
  ADD_ANIME_FOLDER,
  UPDATE_ANIME_FOLDER
} from 'actions';

const initialFoldersMap = new Map();

export default function folders (state = initialFoldersMap, action) {
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