'use strict';

module.exports = {
  main: {
    minimizeMainWindow: 'main:minimizeMainWindow',
    openSelectFolderDialog: 'main:openSelectFolderDialog'
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
    stopSubsScanning: 'renderer:stopSubsScanning',
  }
};
