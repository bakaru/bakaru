import {
  PLAYER_SET_PLAYLIST,
  PLAYER_PLAY,
  PLAYER_PAUSE,
  PLAYER_ACTION_RESET
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
    action: 'play'
  };
}

function playerPause(state) {
  return {
    ...state,
    action: 'pause'
  };
}

function playerResetAction(state) {
  return {
    ...state,
    action: false
  };
}

const defaultState = {
  action: false,
  playlist: []
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

    case PLAYER_ACTION_RESET: return playerResetAction(state);
      break;

    default:
      return state;
      break;
  }
}
