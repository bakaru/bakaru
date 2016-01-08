export const ADD_FOLDER = 'ADD_FOLDER';
export const REMOVE_FOLDER = 'REMOVE_FOLDER';
export const TEST = 'TEST';

export function test (...args) {
  return {
    type: TEST,
    args
  };
}

export function addFolder (path) {
  return {
    type: ADD_FOLDER,
    path
  };
}

export function removeFolder (path) {
  return {
    type: REMOVE_FOLDER,
    path
  };
}
