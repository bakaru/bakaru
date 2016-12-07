import { Action as BaseAction } from 'redux';

export interface State {
  library: boolean,
  player: boolean,
  shyLibrary: boolean
}
const initialState: State = {
  library: true,
  player: false,
  shyLibrary: false
};

const SWITCH_TO_LIBRARY = 'bakaru/ui/switch/library';
type SwitchToLibraryAction = BaseAction & {};
function doSwitchToLibrary(state: State): State {
  return {
    ...state,
    library: true,
    shyLibrary: false,
    player: false
  };
}

const SWITCH_TO_PLAYER = 'bakaru/ui/switch/player';
type SwitchToPlayerAction = BaseAction & {};
function doSwitchToPlayer(state: State): State {
  return {
    ...state,
    library: false,
    shyLibrary: false,
    player: true
  };
}

const SWITCH_TO_SHY_LIBRARY = 'bakaru/ui/switch/shy-library';
type SwitchToShyLibraryAction = BaseAction & {};
function doSwitchToShyLibrary(state: State): State {
  return {
    ...state,
    library: false,
    shyLibrary: true,
    player: false
  };
}

type Action =
  SwitchToLibraryAction |
  SwitchToPlayerAction |
  SwitchToShyLibraryAction
;
export default function ui(state: State = initialState, action: Action): State {
  switch (action.type) {
    case SWITCH_TO_LIBRARY: return doSwitchToLibrary(state);
    case SWITCH_TO_PLAYER: return doSwitchToPlayer(state);
    case SWITCH_TO_SHY_LIBRARY: return doSwitchToShyLibrary(state);

    default: return state;
  }
}

/**
 * Switch UI to library view
 *
 * @returns {{type: string}}
 */
export function switchToLibrary(): SwitchToLibraryAction {
  return {
    type: SWITCH_TO_LIBRARY
  };
}

/**
 * Switch UI to player view
 *
 * @returns {{type: string}}
 */
export function switchToPlayer(): SwitchToPlayerAction {
  return {
    type: SWITCH_TO_PLAYER
  };
}

/**
 * Switch UI to shy library view
 *
 * @returns {{type: string}}
 */
export function switchToShyLibrary(): SwitchToShyLibraryAction {
  return {
    type: SWITCH_TO_SHY_LIBRARY
  };
}
