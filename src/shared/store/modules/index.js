import ui, { attachUI } from './ui'
import player, { attachPlayer } from './player'
import update, { attachUpdate } from './update'
import library, { attachLibrary } from './library'

export default {
  ui,
  player,
  update,
  library
};

export function attach(store) {
  attachUI(store);
  attachPlayer(store);
  attachUpdate(store);
  attachLibrary(store);
}
