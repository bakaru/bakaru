import {
  PLAYER_SET_PLAYLIST,
  PLAYER_PLAY,
  PLAYER_PAUSE
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

/**
 * @param state
 * @param action
 * @returns {*}
 */
export default function player (state = { playlist: false, status: 'idle' }, action) {
  switch (action.type) {
    case PLAYER_SET_PLAYLIST: return playerSetPlaylist(state, action.playlist);
      break;

    case PLAYER_PLAY: return playerPlay(state);
      break;

    case PLAYER_PAUSE: return playerPause(state);
      break;

    default:
      return state;
      break;
  }
}
