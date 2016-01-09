import { ipcRenderer } from 'electron';
import { main, renderer } from 'lib/events';

let store;

// Listeners

ipcRenderer.on(renderer.folderRead, (event, data) => {
  const folders = new Map(data.folders);

  console.log(event, folders);
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
