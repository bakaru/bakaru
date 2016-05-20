import * as actions from '../actions';

function focusOnLibrary() {
  return 'library';
}

function focusOnPlayer() {
  return 'player';
}

function focusOnSettings() {
  return 'settings';
}

/**
 * @param {string} state
 * @param {{type: string}} action
 */
export default function focus(state = 'library', action) {
  switch(action.type) {
    case actions.FOCUS_ON_LIBRARY:
      return focusOnLibrary();
      break;

    case actions.FOCUS_ON_PLAYER:
      return focusOnPlayer();
      break;

    case actions.FOCUS_ON_SETTINGS:
      return focusOnSettings();
      break;

    default:
      return state;
      break;
  }
}