export const ADD_ANIME_FOLDER = 'ADD_ANIME_FOLDER';
export const UPDATE_ANIME_FOLDER = 'UPDATE_ANIME_FOLDER';

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