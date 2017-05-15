import Backend from 'shared/Backend'
import Event from 'shared/Event'

const initialState = {
  entries: new Map(),
  selected: window.localStorage['library-selected-entry'] || null
}

const SET_LIBRARY = 'bakaru/library/setLibrary';
function doSetLibrary(state, { entries }) {
  return {
    ...state,
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
    case SET_LIBRARY: return doSetLibrary(state, action);
    case SET_ENTRY: return doSetEntry(state, action);
    case SELECT: return doSelect(state, action);

    default: return state;
  }
}

export function select(id) {
  return {
    type: SELECT,
    id
  }
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

  Backend.emit(Event.LibraryRequest);
}
