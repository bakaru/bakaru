import folders from './folders';
import flags from './flags';
import state from './state';
import { combineReducers } from 'redux';

export default combineReducers({
  flags,
  state,
  folders
});
