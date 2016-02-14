import {
  PLAYER_SET_PLAYLIST,
  PLAYER_PLAY,
  PLAYER_PAUSE,
  PLAYER_FOCUS,
  PLAYER_BLUR
} from 'actions';

/**
 * @param state
 * @param playlist
 * @returns {{playlist: *}}
 */
function playerSetPlaylist(state, playlist) {
  return {
    ...state,
    playlist
  };
}

function playerPlay(state) {
  return {
    ...state,
    status: 'playing'
  };
}

function playerPause(state) {
  return {
    ...state,
    status: 'paused'
  };
}

function playerFocus(state) {
  return {
    ...state,
    state: 'focused'
  };
}

function playerBlur(state) {
  return {
    ...state,
    state: 'blurred'
  };
}

const defaultState = {
  playlist: false,
  status: 'idle',
  state: 'blurred'
};

/**
 * @param state
 * @param action
 * @returns {*}
 */
export default function player (state = defaultState, action) {
  switch (action.type) {
    case PLAYER_SET_PLAYLIST: return playerSetPlaylist(state, action.playlist);
      break;

    case PLAYER_PLAY: return playerPlay(state);
      break;

    case PLAYER_PAUSE: return playerPause(state);
      break;

    case PLAYER_FOCUS: return playerFocus(state);
      break;

    case PLAYER_BLUR: return playerBlur(state);
      break;

    default:
      return state;
      break;
  }
}
