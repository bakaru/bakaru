import Backend from 'shared/Backend'
import Event from 'shared/Event'

const initialState = {
  checking: false,
  available: false,
  downloading: false,
  downloadInfo: {},
  downloaded: false
};

const SET_CHECKING = 'bakaru/update/setChecking';
function doSetChecking(state) {
  return {
    ...state,
    checking: true
  }
}

const SET_AVAILABLE = 'bakaru/update/setAvailable';
function doSetAvailable(state) {
  return {
    ...state,
    checking: false,
    available: true
  }
}

const SET_NOT_AVAILABLE = 'bakaru/update/setNotAvailable';
function doSetNotAvailable(state) {
  return {
    ...state,
    checking: false,
    available: false
  }
}

const SET_DOWNLOADING = 'bakaru/update/setDownloading';
function doSetDownloading(state, { downloadInfo }) {
  return {
    ...state,
    checking: false,
    available: true,
    downloading: true,
    downloadInfo
  }
}

const SET_DOWNLOADED = 'bakaru/update/setDownloaded';
function doSetDownloaded(state) {
  return {
    ...state,
    downloading: false,
    downloadInfo: {},
    downloaded: true
  }
}

const SET_NOT_DOWNLOADED = 'bakaru/update/setNotDownloaded';
function doSetNotDownloaded(state) {
  return {
    ...state,
    downloading: false,
    downloadInfo: {},
    downloaded: false
  }
}

export default function update(state = initialState, action) {
  switch (action.type) {
    case SET_CHECKING: return doSetChecking(state);
    case SET_AVAILABLE: return doSetAvailable(state);
    case SET_NOT_AVAILABLE: return doSetNotAvailable(state);
    case SET_DOWNLOADING: return doSetDownloading(state, action);
    case SET_DOWNLOADED: return doSetDownloaded(state);
    case SET_NOT_DOWNLOADED: return doSetNotDownloaded(state);

    default: return state;
  }
}

/**
 * @api
 */
export function check() {
  Backend.emit(Event.UpdateCheck);
}

/**
 * @api
 */
export function perform() {
  Backend.emit(Event.UpdatePerform);
}

export function attachUpdate({ dispatch }) {
  Backend.on(Event.UpdateCheckPending, () => dispatch({ type: SET_CHECKING }));
  Backend.on(Event.UpdateAvailable, () => dispatch({ type: SET_AVAILABLE }));
  Backend.on(Event.UpdateNotAvailable, () => dispatch({ type: SET_NOT_AVAILABLE }));
  Backend.on(Event.UpdateCheckPending, () => dispatch({ type: SET_CHECKING }));
  Backend.on(Event.UpdateDownloading, (downloadInfo) => dispatch({ type: SET_CHECKING, downloadInfo }));
  Backend.on(Event.UpdateDownloaded, () => dispatch({ type: SET_DOWNLOADED }));
}
