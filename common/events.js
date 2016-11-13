'use strict';

/**
 * @module common/events
 */

/**
 * @typedef {{minimizeMainWindow: string, openSelectFolderDialog: string}} MainEvents
 */

/**
 * @typedef {{flagAddAnimeFolderStart: string, flagAddAnimeFolderEnd: string, addAnimeFolder: string, addEpisodes: string, updateEpisodes: string, updateEpisode: string, updateDubs: string, updateSubs: string, updateAnimeFolder: string, setMediaInfo: string, stopScanning: string, startMediaInfoScanning: string, stopMediaInfoScanning: string, startSubsScanning: string, stopSubsScanning: string}} RendererEvents
 */

module.exports = {
  main: {
    minimizeMainWindow: 'main:minimizeMainWindow',
    openSelectFolderDialog: 'main:openSelectFolderDialog',
    rescanFolder: 'main:rescanFolder'
  },

  renderer: {
    flagAddAnimeFolderStart: 'renderer:flagAddAnimeFolderStart',
    flagAddAnimeFolderEnd: 'renderer:flagAddAnimeFolderEnd',

    addAnimeFolder: 'renderer:addAnimeFolder',
    addEpisodes: 'renderer:addEpisodes',
    updateEpisodes: 'renderer:updateEpisodes',
    updateEpisode: 'renderer:updateEpisode',
    updateDubs: 'renderer:updateDubs',
    updateSubs: 'renderer:updateSubs',
    updateAnimeFolder: 'renderer:updateAnimeFolder',
    setMediaInfo: 'renderer:setMediaInfo',

    stopScanning: 'renderer:stopScanning',

    startMediaInfoScanning: 'renderer:startMediaInfoScanning',
    stopMediaInfoScanning: 'renderer:stopMediaInfoScanning',

    startSubsScanning: 'renderer:startSubsScanning',
    stopSubsScanning: 'renderer:stopSubsScanning'
  },
};
