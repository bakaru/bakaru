import Window from 'gui/control/Window'

export const library = 'library';
export const shyLibrary = 'shyLibrary';
export const player ='player';

const initialState = {
  view: library,
  maximized: Window.isMaximized()
};

const SET_VIEW = 'bakaru/ui/setView';
function doSetView(state, { view }) {
  return {
    ...state,
    view
  }
}

const SET_MAXIMIZED = 'bakaru/ui/setMaximized';
function doSetMaximized(state) {
  return {
    ...state,
    maximized: Window.isMaximized()
  }
}

export default function ui(state = initialState, action) {
  switch (action.type) {
    case SET_VIEW: return doSetView(state, action);
    case SET_MAXIMIZED: return doSetMaximized(state);

    default: return state;
  }
}

export function toLibrary() {
  return {
    type: SET_VIEW,
    view: library
  }
}

export function toShyLibrary() {
  return {
    type: SET_VIEW,
    view: shyLibrary
  }
}

export function toPlayer() {
  return {
    type: SET_VIEW,
    view: player
  }
}

export function attachUI({ dispatch }) {
  window.addEventListener('resize', function () {
    dispatch({
      type: SET_MAXIMIZED
    });
  })
}
