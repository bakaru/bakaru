import { ipcRenderer } from 'electron';
import { main, renderer } from 'lib/events';

let store;

// Listeners

ipcRenderer.on(renderer.folderRead, (event, path) => {
  console.log(event, path);
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
