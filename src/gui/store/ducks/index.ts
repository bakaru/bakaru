import ui, { State as UiState } from './ui';
import library, { State as LibraryState } from './library';

export type State = {
  ui: UiState,
  library: LibraryState
};

export default {
  ui,
  library
}
