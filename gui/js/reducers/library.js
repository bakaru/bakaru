import {
  ADD_ANIME_FOLDER,
  UPDATE_ANIME_FOLDER,
  OPEN_ANIME_FOLDER
} from 'actions';

/**
 * @typedef {{selected: boolean|string, entries: Map.<string, AnimeFolder>}} LibraryState
 */

/**
 * @param {LibraryState} state
 * @param {AnimeFolder} animeFolder
 * @returns {Map}
 */
function addAnimeFolder(state, animeFolder) {
  const entries = new Map(state.entries);
  entries.set(animeFolder.id, animeFolder);

  return {
    ...state,
    entries
  };
}

/**
 * @param {LibraryState} state
 * @param {AnimeFolder} animeFolder
 * @returns {Map}
 */
function updateAnimeFolder(state, animeFolder) {
  const entries = new Map(state.entries);
  entries.set(animeFolder.id, animeFolder);

  return {
    ...state,
    entries
  };
}

/**
 * @param {LibraryState} state
 * @param animeFolderId
 * @returns {{selected: *}}
 */
function openAnimeFolder(state, animeFolderId) {
  return {
    ...state,
    selected: animeFolderId
  };
}

/**
 * @type {LibraryState}
 */
const initialState = {
  selected: false,
  entries: new Map()
};

/**
 * @param {LibraryState} [state=]
 * @param {{type: String, animeFolder: AnimeFolder=}} action
 * @returns {Map}
 */
export default function library (state = initialState, action) {
  switch (action.type) {
    case ADD_ANIME_FOLDER: return addAnimeFolder(state, action.animeFolder);
      break;

    case UPDATE_ANIME_FOLDER: return updateAnimeFolder(state, action.animeFolder);
      break;

    case OPEN_ANIME_FOLDER: return openAnimeFolder(state, action.id);
      break;

    default:
      return state;
      break;
  }
}