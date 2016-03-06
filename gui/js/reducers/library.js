import {
  ADD_ANIME_FOLDER,
  UPDATE_ANIME_FOLDER,
  OPEN_ANIME_FOLDER
} from 'actions';

/**
 * @typedef {{selected: boolean|string, entries: Map.<string, AnimeFolder>}} LibraryState
 */

let entriesIds = new Set();

/**
 * Updates cache
 *
 * @param {AnimeFolder} animeFolder
 */
function updateCache(animeFolder) {
  window.setImmediate(() => window.localStorage['library'] = JSON.stringify([...entriesIds.add(animeFolder.id)]));

  window.localStorage[animeFolder.id] = JSON.stringify(animeFolder);
}

/**
 * Restore library entries from cache
 *
 * @returns {Map}
 */
function restoreFromCache() {
  const entries = new Map();

  if (typeof window.localStorage['library'] !== 'undefined') {
    entriesIds = new Set(JSON.parse(window.localStorage['library']));

    for (let entryId of entriesIds) {
      entries.set(entryId, JSON.parse(window.localStorage[entryId]));
    }
  }

  return entries;
}

/**
 * @param {LibraryState} state
 * @param {AnimeFolder} animeFolder
 * @returns {Map}
 */
function addAnimeFolder(state, animeFolder) {
  const entries = new Map(state.entries);
  entries.set(animeFolder.id, animeFolder);

  updateCache(animeFolder);

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

  updateCache(animeFolder);

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
  entries: restoreFromCache()
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