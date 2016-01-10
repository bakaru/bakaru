import { OPEN_ANIME_FOLDER } from 'actions';

const initialState = {
  openedFolder: null
};

function openAnimeFolder(state, id) {
  return {
    ...state,
    openedFolder: id
  };
}

export default function stateReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_ANIME_FOLDER:
      return openAnimeFolder(state, action.id);
      break;

    default:
      return state;
      break;
  }
}