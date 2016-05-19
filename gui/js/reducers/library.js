import {
  UPDATE_ANIME_FOLDER,
  OPEN_ANIME_FOLDER
} from 'actions';

import ARSON from 'arson';

window.ARSON = ARSON;

/**
 * @typedef {{selected: boolean|string, entries: Map.<string, AnimeFolder>}} LibraryState
 */

let entriesIds = new Set();

let cacheUpdateTimeout = null;

/**
 * Updates cache
 *
 * @param {AnimeFolder} animeFolder
 */
function updateCache(animeFolder) {
  window.clearTimeout(cacheUpdateTimeout);

  cacheUpdateTimeout = window.setTimeout(() => {
    window.localStorage['library'] = JSON.stringify([...entriesIds.add(animeFolder.id)]);
  }, 200);

  window.localStorage[animeFolder.id] = ARSON.stringify(animeFolder);
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
      entries.set(entryId, ARSON.parse(window.localStorage[entryId]));
    }
  }

  return entries;
}

function restoreSelectedAnimeFolderId() {
  if (typeof window.localStorage['selected'] !== "undefined") {
    const selectedAnimeFolderId = window.localStorage['selected'];

    if (entriesIds.has(selectedAnimeFolderId)) {
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
  entries: restoreFromCache(),
  selected: restoreSelectedAnimeFolderId()
};

/**
 * @param {LibraryState} [state=]
 * @param {{type: String, animeFolder: AnimeFolder=}} action
 * @returns {Map}
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