import { ipcRenderer } from 'electron';

let store;

const setStore = originStore => {
  store = originStore;
};

const minimizeMainWindow = () => {
  ipcRenderer.send('rpc:minimizeMainWindow');
};

export {
  setStore,
  minimizeMainWindow
};
