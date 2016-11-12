import {
  UPDATE_ANIME_FOLDER,
  OPEN_ANIME_FOLDER,
  DELETE_ANIME_FOLDER,
  SELECT_SUB,
  SELECT_DUB
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

function selectSub(state, { entryId, subId }) {
  console.log('Selecting sub', entryId, subId);

  const entries = new Map(state.entries);
  const entry = Object.assign({}, entries.get(entryId));

  entry.selections = Object.assign({}, entry.selections);
  entry.selections.subs = subId;

  return {
    ...state,
    entries
  };
}

function selectDub(state, { entryId, dubId }) {
  console.log('Selecting dub', entryId, dubId);

  const entries = new Map(state.entries);
  const entry = Object.assign({}, entries.get(entryId));

  entry.selections = Object.assign({}, entry.selections);
  entry.selections.dubs = dubId;

  return {
    ...state,
    entries
  };
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
 * @param {string} id
 * @return {LibraryState}
 */
function deleteAnimeFolder(state, id) {
  const entries = new Map(state.entries);
  entries.delete(id);

  console.log('DELETED', id, 'FROM STATE');

  return {
    ...state,
    entries
  }
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
    case OPEN_ANIME_FOLDER: return openAnimeFolder(state, action.id);
    case DELETE_ANIME_FOLDER: return deleteAnimeFolder(state, action.id);

    case SELECT_SUB: return selectSub(state, action);
    case SELECT_DUB: return selectDub(state, action);

    default: return state;
  }
}
