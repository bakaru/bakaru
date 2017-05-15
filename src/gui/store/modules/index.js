import ui, { attachUI } from './ui'
import player, { attachPlayer } from './player'
import library, { attachLibrary } from './library'

export default {
  ui,
  player,
  library
};

export function attach(store) {
  attachUI(store);
  attachPlayer(store);
  attachLibrary(store);
}
