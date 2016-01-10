import { FLAG_ADD_FOLDER_END, FLAG_ADD_FOLDER_START } from 'actions';

/**
 * @typedef {{addFolder: boolean}} FlagsState
 */

/**
 * @type {FlagsState}
 */
const initialFlags = {
  addFolder: false
};

/**
 * @param {FlagsState} state
 * @returns {FlagsState}
 */
function flagAddFolderStart(state) {
  return {
    ...state,
    addFolder: true
  };
}

/**
 * @param {FlagsState} state
 * @returns {FlagsState}
 */
function flagAddFolderEnd(state) {
  return {
    ...state,
    addFolder: false
  };
}

/**
 * @param {FlagsState} state
 * @param {{type: string}} action
 */
export default function flags(state = initialFlags, action) {
  switch (action.type) {
    case FLAG_ADD_FOLDER_START:
      return flagAddFolderStart(state);
      break;

    case FLAG_ADD_FOLDER_END:
      return flagAddFolderEnd(state);
      break;

    default:
      return state;
      break;
  }
}