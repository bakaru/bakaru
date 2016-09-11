import * as actions from 'actions';
import { ipcRenderer } from 'electron';
import { events } from 'common';

/**
 * @type {RendererEvents} re
 */
const re = events.renderer;

import LibraryManager from './LibraryManager';
const lm = new LibraryManager();

const entryUpdater = func => {
  func = func.bind(lm);

  return (event, payload) => {
    lm.store.dispatch(actions.updateAnimeFolder(func(payload)));
  };
};
ipcRenderer.on(re.addAnimeFolder, entryUpdater(lm.create));
ipcRenderer.on(re.addEpisodes, entryUpdater(lm.addEpisodes));
ipcRenderer.on(re.updateEpisode, entryUpdater(lm.updateEpisode));
ipcRenderer.on(re.updateDubs, entryUpdater(lm.updateDubs));
ipcRenderer.on(re.updateSubs, entryUpdater(lm.updateSubs));
ipcRenderer.on(re.setMediaInfo, entryUpdater(lm.setMediaInfo));
ipcRenderer.on(re.stopSubsScanning, entryUpdater(lm.stopSubsScanning));
ipcRenderer.on(re.startMediaInfoScanning, entryUpdater(lm.startMediaInfoScanning));
ipcRenderer.on(re.stopMediaInfoScanning, entryUpdater(lm.stopMediaInfoScanning));
ipcRenderer.on(re.stopScanning, entryUpdater(lm.stopScanning));

ipcRenderer.on(re.flagAddAnimeFolderStart, _ => {
  lm.store.dispatch(actions.flagAddFolderStart());
});
ipcRenderer.on(re.flagAddAnimeFolderEnd, _ => {
  lm.store.dispatch(actions.flagAddFolderEnd());
});

export default lm;