import Backend from 'shared/Backend'
import Event from 'shared/Event'

function broadcastEntryUpdate(entry) {
  Backend.emit(Event.EntryUpdate, entry);
}

const initialState = {
  loaded: false,
  entries: new Map(),
  selected: window.localStorage['library-selected-entry'] || null
}

const SET_LIBRARY = 'bakaru/library/setLibrary';
function doSetLibrary(state, { entries }) {
  return {
    ...state,
    loaded: true,
    entries
  }
}

const SET_ENTRY = 'bakaru/library/setEntry';
function doSetEntry(state, { entry }) {
  const entries = new Map(state.entries);

  entries.set(entry.id, entry);

  return {
    ...state,
    entries
  }
}

const DELETE_ENTRY = 'bakaru/library/deleteEntry';
function doDeleteEntry(state, { id }) {
  const entries = new Map(state.entries);

  entries.delete(id);

  const newState = {
    ...state,
    entries
  };

  if (id === state.current) {
    return doSelect(newState, {
      id: [...entries.keys()][0] || null
    });
  }

  return newState;
}

const SET_ENTRY_EPISODE_WATCHED = 'bakaru/library/setEntryEpisodeWatched';
function doSetEntryEpisodeWatched(state, { entryId, episodeId, watched }) {
  const entries = new Map(state.entries);

  const entry = {...entries.get(entryId)};
  entry.episodes = new Map(entry.episodes);

  const episode = {
    ...entry.episodes.get(episodeId),
    watched
  };

  entry.episodes.set(episodeId, episode);
  entries.set(entryId, entry);

  broadcastEntryUpdate(entry);

  return {
    ...state,
    entries
  }
}

const SET_ENTRY_EPISODE_STOPPED_AT = 'bakaru/library/setEntryEpisodeStoppedAt';
function doSetEntryEpisodeStoppedAt(state, { entryId, episodeId, stoppedAt }) {
  const entries = new Map(state.entries);

  const entry = {...entries.get(entryId)};
  entry.episodes = new Map(entry.episodes);

  const episode = {
    ...entry.episodes.get(episodeId),
    stoppedAt
  };

  entry.episodes.set(episodeId, episode);
  entries.set(entryId, entry);

  broadcastEntryUpdate(entry);

  return {
    ...state,
    entries
  }
}

const SELECT = 'bakaru/library/select';
function doSelect(state, { id }) {
  window.localStorage['library-selected-entry'] = id;

  return {
    ...state,
    selected: id
  }
}

export default function library(state = initialState, action) {
  switch (action.type) {
    case SET_ENTRY_EPISODE_STOPPED_AT: return doSetEntryEpisodeStoppedAt(state, action);
    case SET_ENTRY_EPISODE_WATCHED: return doSetEntryEpisodeWatched(state, action);
    case SET_LIBRARY: return doSetLibrary(state, action);
    case SET_ENTRY: return doSetEntry(state, action);
    case SELECT: return doSelect(state, action);
    case DELETE_ENTRY: return doDeleteEntry(state, action);

    default: return state;
  }
}

export function setWatched(entryId, episodeId, watched = true) {
  return {
    type: SET_ENTRY_EPISODE_WATCHED,
    entryId,
    episodeId,
    watched
  }
}

export function setStoppedAt(entryId, episodeId, stoppedAt) {
  return {
    type: SET_ENTRY_EPISODE_STOPPED_AT,
    entryId,
    episodeId,
    stoppedAt
  }
}

export function select(id) {
  return {
    type: SELECT,
    id
  }
}

export function remove(id) {
  Backend.emit(Event.EntryDelete, id);
}

export function attachLibrary({ dispatch }) {
  function dispatchEntry(entry) {
    dispatch({
      type: SET_ENTRY,
      entry
    });
  }

  Backend.on(Event.LibraryResponse, entries => dispatch({
    type: SET_LIBRARY,
    entries
  }));

  Backend.on(Event.EntryUpdated, dispatchEntry);
  Backend.on(Event.EntryExplored, dispatchEntry);
  Backend.on(Event.EntryDeleted, id => dispatch({ type: DELETE_ENTRY, id }));

  Backend.emit(Event.LibraryRequest);
}
