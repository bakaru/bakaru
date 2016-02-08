import * as actions from 'actions';
import { ipcRenderer } from 'electron';
import { main, renderer } from 'events';

let store;

export function setStore (originStore) {
  store = originStore;
};

// Listeners

ipcRenderer.on(renderer.addAnimeFolder, (event, animeFolder) => {
  store.dispatch(actions.addAnimeFolder(animeFolder));
});

ipcRenderer.on(renderer.updateAnimeFolder, (event, animeFolder) => {
  store.dispatch(actions.updateAnimeFolder(animeFolder));
});

ipcRenderer.on(renderer.flagAddAnimeFolderStart, () => {
  store.dispatch(actions.flagAddFolderStart());
});

ipcRenderer.on(renderer.flagAddAnimeFolderEnd, () => {
  store.dispatch(actions.flagAddFolderEnd());
});

// Senders

export function minimizeMainWindow () {
  ipcRenderer.send(main.minimizeMainWindow);
};

export function openSelectFolderDialog () {
  ipcRenderer.send(main.openSelectFolderDialog);
}
