import ui, { attachUI } from './ui'
import library, { attachLibrary } from './library'

export default {
  ui,
  library
};

export function attach(store) {
  attachUI(store);
  attachLibrary(store);
}
