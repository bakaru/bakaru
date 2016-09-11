// Library
export const ADD_ANIME_FOLDER = 'ADD_ANIME_FOLDER';
export const UPDATE_ANIME_FOLDER = 'UPDATE_ANIME_FOLDER';
export const OPEN_ANIME_FOLDER = 'OPEN_ANIME_FOLDER';
export const DELETE_ANIME_FOLDER = 'DELETE_ANIME_FOLDER';

export function addAnimeFolder(animeFolder) {
  return {
    type: ADD_ANIME_FOLDER,
    animeFolder
  }
}

export function updateAnimeFolder(animeFolder) {
  return {
    type: UPDATE_ANIME_FOLDER,
    animeFolder
  }
}

export function openAnimeFolder(id) {
  return {
    type: OPEN_ANIME_FOLDER,
    id
  }
}

export function deleteAnimeFolder(id) {
  return {
    type: DELETE_ANIME_FOLDER,
    id
  }
}

// Flags
export const FLAG_ADD_FOLDER_START = 'FLAG_ADD_FOLDER_START';
export const FLAG_ADD_FOLDER_END = 'FLAG_ADD_FOLDER_END';

export function flagAddFolderStart() {
  return {
    type: FLAG_ADD_FOLDER_START
  };
}

export function flagAddFolderEnd() {
  return {
    type: FLAG_ADD_FOLDER_END
  };
}

// Player
export const PLAYER_SET_PLAYLIST = 'PLAYER_SET_PLAYLIST';
export const PLAYER_PLAY = 'PLAYER_PLAY';
export const PLAYER_PAUSE = 'PLAYER_PAUSE';
export const PLAYER_ACTION_RESET = 'PLAYER_ACTION_RESET';

export function playerSetPlaylist(playlist) {
  return {
    type: PLAYER_SET_PLAYLIST,
    playlist
  };
}

export function playerPlay() {
  return {
    type: PLAYER_PLAY
  };
}

export function playerPause() {
  return {
    type: PLAYER_PAUSE
  };
}

export function playerActionReset() {
  return {
    type: PLAYER_ACTION_RESET
  };
}

// Focus
export const FOCUS_ON_LIBRARY = 'FOCUS_ON_LIBRARY';
export const FOCUS_ON_PLAYER = 'FOCUS_ON_PLAYER';
export const FOCUS_ON_SETTINGS = 'FOCUS_ON_SETTINGS';

export function focusOnLibrary() {
  return {
    type: FOCUS_ON_LIBRARY
  };
}

export function focusOnPlayer() {
  return {
    type: FOCUS_ON_PLAYER
  };
}

export function focusOnSettings() {
  return {
    type: FOCUS_ON_SETTINGS
  };
}

// Settings
export const SETTINGS_SAVE = 'SETTINGS_SAVE';
export const SETTINGS_RESET = 'SETTINGS_RESET';

export function settingsSave(setting, value) {
  return {
    type: SETTINGS_SAVE,
    setting,
    value
  };
}

export function settingsReset(setting) {
  return {
    type: SETTINGS_RESET,
    setting
  };
}
