import {
  ADD_ANIME_FOLDER,
  UPDATE_ANIME_FOLDER
} from 'actions';

/**
 * @param {Map} state
 * @param {AnimeFolder} animeFolder
 * @returns {Map}
 */
function addAnimeFolder(state, animeFolder) {
  const newState = new Map(state);
  newState.set(animeFolder.id, animeFolder);

  return newState;
}

/**
 * @param {Map} state
 * @param {AnimeFolder} animeFolder
 * @returns {Map}
 */
function updateAnimeFolder(state, animeFolder) {
  const newState = new Map(state);
  newState.set(animeFolder.id, animeFolder);
  return newState;
}

/**
 * @param {Map|undefined} [state=Map]
 * @param {{type: String, animeFolder: AnimeFolder=}} action
 * @returns {Map}
 */
export default function folders (state = new Map(), action) {
  switch (action.type) {
    case ADD_ANIME_FOLDER: return addAnimeFolder(state, action.animeFolder);
      break;

    case UPDATE_ANIME_FOLDER: return updateAnimeFolder(state, action.animeFolder);
      break;

    default:
      return state;
      break;
  }
}