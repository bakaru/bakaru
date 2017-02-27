import { trigger, listen } from './connection';

export enum UIState {
  Library,
  ShyLibrary,
  Player
}

export const UI = {
  SendSyncState(state: UIState) {
    console.log('Syncing state', state);

    trigger<void>('ui::syncedstate', state);
  }
};
