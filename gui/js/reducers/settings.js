import {
  SETTINGS_SAVE,
  SETTINGS_RESET
} from 'actions';

// Default settings ====================================================================================================
const initialSettings = {
  player_pause_on_click: true
};
// Default settings ====================================================================================================

function save(state, setting, value) {
  return {
    ...state,
    [setting]: value
  };
}

function reset(state, setting) {
  return {
    ...state,
    [setting]: initialSettings[setting]
  };
}

export default function settings(state = initialSettings, action) {
  switch(action.type) {
    case SETTINGS_SAVE:
      return save(state, action.setting, action.value);
      break;

    case SETTINGS_RESET:
      return reset(state, action.setting);
      break;

    default:
      return state;
      break;
  }
}