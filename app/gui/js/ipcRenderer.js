import * as actions from 'actions';
import { ipcRenderer } from 'electron';
import { main, renderer } from 'lib/events';

let store;

// Listeners

ipcRenderer.on(renderer.addAnimeFolder, (event, animeFolder) => {
  store.dispatch(actions.addAnimeFolder(animeFolder));
});

ipcRenderer.on(renderer.updateAnimeFolder, (event, animeFolder) => {
  store.dispatch(actions.updateAnimeFolder(animeFolder));
});

// Senders

export function setStore (originStore) {
  store = originStore;
};

export function minimizeMainWindow () {
  ipcRenderer.send(main.minimizeMainWindow);
};

export function openSelectFolderDialog () {
  ipcRenderer.send(main.openSelectFolderDialog);
}
