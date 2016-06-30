import {
  UPDATE_ANIME_FOLDER,
  OPEN_ANIME_FOLDER
} from 'actions';

/**
 * @type LibraryManager
 */
import LibraryManager from '../LibraryManager';

/**
 * @typedef {{selected: boolean|string, entries: Map.<string, AnimeFolder>}} LibraryState
 */

function restoreSelectedAnimeFolderId() {
  if (typeof window.localStorage['selected'] !== "undefined") {
    const selectedAnimeFolderId = window.localStorage['selected'];

    if (LibraryManager.entriesIds.has(selectedAnimeFolderId)) {
      return selectedAnimeFolderId;
    }
  }

  return false;
}

/**
 * @param {string} id
 */
function updateSelectedAnimeFolderId(id) {
  setImmediate(() => {
    window.localStorage['selected'] = id;
  });
}

/**
 * @param {LibraryState} state
 * @param {AnimeFolder} animeFolder
 * @returns {LibraryState}
 */
function updateAnimeFolder(state, animeFolder) {
  const entries = new Map(state.entries);
  entries.set(animeFolder.id, animeFolder);

  LibraryManager.updateCache(animeFolder);

  return {
    ...state,
    entries
  };
}

/**
 * @param {LibraryState} state
 * @param animeFolderId
 * @returns {LibraryState}
 */
function openAnimeFolder(state, animeFolderId) {
  updateSelectedAnimeFolderId(animeFolderId);

  return {
    ...state,
    selected: animeFolderId
  };
}

/**
 * @type {LibraryState}
 */
const initialState = {
  entries: LibraryManager.getLibrary(),
  selected: restoreSelectedAnimeFolderId()
};

/**
 * @param {LibraryState} [state=]
 * @param {{type: String, id: string=, animeFolder: AnimeFolder=}} action
 * @returns {LibraryState}
 */
export default function library (state = initialState, action) {
  switch (action.type) {
    case UPDATE_ANIME_FOLDER: return updateAnimeFolder(state, action.animeFolder);
      break;

    case OPEN_ANIME_FOLDER: return openAnimeFolder(state, action.id);
      break;

    default:
      return state;
      break;
  }
}