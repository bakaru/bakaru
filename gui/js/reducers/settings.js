import {
  SETTINGS_SAVE,
  SETTINGS_RESET
} from 'actions';

// Default settings ====================================================================================================
const initialSettings = {
  player_pause_on_click: true
};
// Default settings ====================================================================================================

function persist(settings) {
  window.localStorage['settings'] = JSON.stringify(settings);
}

function hydrate() {
  if (typeof window.localStorage['settings'] === "undefined") {
    return initialSettings;
  } else {
    return JSON.parse(window.localStorage['settings']);
  }
}

function save(state, setting, value) {
  const settings = {
    ...state,
    [setting]: value
  };

  persist(settings);

  return settings;
}

function reset(state, setting) {
  return {
    ...state,
    [setting]: initialSettings[setting]
  };
}

export default function settings(state = hydrate(), action) {
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