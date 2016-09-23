const mkdirp = require('mkdirp').sync;
const path = require('path');

const RootApp = require('electron').app;
const Syncer = require('./Syncer');

/**
 * Boots up Syncer
 *
 * @returns {Syncer}
 */
function bootSyncer() {
  const libraryPath = path.join(RootApp.getPath('userData'), 'BakaruLibrary');

  mkdirp(libraryPath);

  return new Syncer(libraryPath);
}

class LibraryManager {

  /**
   * Ctor
   *
   * @param {ServerContext} context
   */
  constructor(context) {
    this.name = 'LibraryManager';
    this.events = context.events;

    this.syncer = bootSyncer();
    this.syncer.resurrect().then(this.onLibraryResurrect.bind(this));

    this.entries = new Map();
    this.voiceOvers = new Map();
    this.subtitles = new Map();
  }

  onLibraryResurrect(entriesIds) {

  }
}

module.exports = LibraryManager;
