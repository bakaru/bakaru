import {
  SETTINGS_SAVE,
  SETTINGS_RESET
} from 'actions';

// Default settings ====================================================================================================
const initialSettings = {
  player_pause_on_click: true,
  player_after_play_action: 'next',
  player_match_size: true,
  
  interface_main_colour: 'hsl(335, 100%, 50%)',
  interface_main_colour_light: 'hsla(335, 100%, 50%, .4)',
  interface_main_colour_contrast: 'rgb(255, 255, 255)',
  interface_bg_colour: '#fefefe',

  mal_login: 'ololo',
  mal_pass: '123456'
};
// Default settings ====================================================================================================

/**
 * This is not a java, this is not a java they said
 *
 * @param settings
 */
function persist(settings) {
  window.localStorage['settings'] = JSON.stringify(settings);
}

/**
 * This is not a java, this is not a java they said
 *
 * @returns {{player_pause_on_click: boolean}}
 */
function hydrate() {
  if (typeof window.localStorage['settings'] === "undefined") {
    return initialSettings;
  } else {
    return Object.assign({}, initialSettings, JSON.parse(window.localStorage['settings']));
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