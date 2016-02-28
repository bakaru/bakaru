import library from './library';
import flags from './flags';
import player from './player';
import focus from './focus';
import { combineReducers } from 'redux';

export default combineReducers({
  flags,
  focus,
  player,
  library
});
