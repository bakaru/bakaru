export const ADD_ANIME_FOLDER = 'ADD_ANIME_FOLDER';
export const UPDATE_ANIME_FOLDER = 'UPDATE_ANIME_FOLDER';
export const TEST = 'TEST';

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

export function test(...args) {
  return {
    type: TEST,
    args
  };
}