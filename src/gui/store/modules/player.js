import Player from 'gui/control/Player'

const initialState = {
  entryId: window.localStorage['player-entry-id'] || null,
  episodeId: window.localStorage['player-episode-id'] || null,
  time: 0,
  playing: false,
  volume: parseFloat(window.localStorage['player-volume']) || 100.0,
  muted: window.localStorage['player-muted'] === 'true'
};

const SET_MEDIA = 'bakaru/player/setMedia';
function doSetMedia(state, { entryId, episodeId }) {
  window.localStorage['player-entry-id'] = entryId;
  window.localStorage['player-episode-id'] = episodeId;

  return {
    ...state,
    entryId,
    episodeId
  }
}

const SET_TIME = 'bakaru/player/setTime';
function doSetTime(state, { time }) {
  return {
    ...state,
    time
  }
}

const SET_PLAYING = 'bakaru/player/setPlaying';
function doSetPlaying(state, { playing }) {
  return {
    ...state,
    playing: !!playing
  }
}

const SET_VOLUME = 'bakaru/player/setVolume';
function doSetVolume(state, { volume }) {
  return {
    ...state,
    volume: parseFloat(volume)
  }
}

const SET_MUTED = 'bakaru/player/setMuted';
function doSetMuted(state, { mute }) {
  return {
    ...state,
    muted: !!mute
  }
}

export default function playerReducer(state = initialState, action) {
  switch (action.type) {
    case SET_MEDIA: return doSetMedia(state, action);
    case SET_TIME: return doSetTime(state, action);
    case SET_PLAYING: return doSetPlaying(state, action);
    case SET_VOLUME: return doSetVolume(state, action);
    case SET_MUTED: return doSetMuted(state, action);

    default: return state;
  }
}

export function attachPlayer({ dispatch }) {
  Player.onPlay(() => dispatch({ type: SET_PLAYING, playing: true }));
  Player.onPause(() => dispatch({ type: SET_PLAYING, playing: false }));
  Player.onMedia(media => dispatch({ type: SET_MEDIA, ...media }));
  Player.onVolume(volume => dispatch({ type: SET_VOLUME, volume }));
  Player.onMute(mute => dispatch({ type: SET_MUTED, mute }));
  Player.onSeek(time => dispatch({ type: SET_TIME, time }));
}
