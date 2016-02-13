export const ADD_ANIME_FOLDER = 'ADD_ANIME_FOLDER';
export const UPDATE_ANIME_FOLDER = 'UPDATE_ANIME_FOLDER';
export const OPEN_ANIME_FOLDER = 'OPEN_ANIME_FOLDER';

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