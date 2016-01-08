import { ipcRenderer } from 'electron';
import { main, renderer } from 'lib/events';

let store;

export function setStore (originStore) {
  store = originStore;
};

export function minimizeMainWindow () {
  ipcRenderer.send(main.minimizeMainWindow);
};

// Listeners

// ipcRenderer.on('');
