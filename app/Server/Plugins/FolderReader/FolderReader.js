const coreObjectsCreators = require('../coreObjectsCreators');
const coreEvents = require('../coreEvents');
const bluebird = require('bluebird');
const path = require('path');
const {
  readdirAsync: read,
  statAsync: stat
} = bluebird.promisifyAll(require('fs'));

const classify = require('./classify');
const isSeries = require('./isSeries');

const makeSeriesEntry = require('./makers/seriesEntry');
const makeStandAlone = require('./makers/standAlone');

class FolderReader {

  /**
   * Ctor
   *
   * @param {ServerContext} context
   */
  constructor(context) {
    this.name = 'FolderReader';
    this.events = context.events;

    context.events.on(coreEvents.folderAdded, this.onFolderAdded.bind(this));
  }

  /**
   * Listens for folder added events
   *
   * @param {string} folderPath
   */
  onFolderAdded(folderPath) {
    const normalizedPath = folderPath.normalize();

    stat(normalizedPath)
      .then(normalizedPathStats => {
        if (!normalizedPathStats.isDirectory()) {
          return this.events.emit(coreEvents.errors.folderNotFolder, folderPath);
        }

        return this.readFolder(folderPath);
      })
      .catch(() => this.events.emit(coreEvents.errors.folderNotExist, folderPath));
  }

  /**
   * Recursively reads folder
   *
   * @param {string} folderPath
   * @returns {Promise}
   */
  readFolder(folderPath) {
    return read(folderPath)
      .then(items => items.map(item => path.join(folderPath, item)))
      .then(classify)
      .then(classes => {
        if (isSeries(classes)) {
          this.processSeries(folderPath, classes);
        } else {
          this.processNonSeries(classes);
        }

        return classes;
      });
  }

  /**
   * Process series
   *
   * @param {string} seriesPath
   * @param {ClassifiedFolderItems} classes
   */
  processSeries(seriesPath, classes) {
    makeSeriesEntry(seriesPath, classes).then(entry => this.events.emit(coreEvents.entryRead, entry));
  }

  /**
   * Processes non series folder items
   *
   * @param {ClassifiedFolderItems} classes
   */
  processNonSeries(classes) {
    // Sub folders
    if (classes.folders.length > 0) {
      classes.folders.map(folder => this.readFolder(folder));
    }

    // Standalone videos, movies may be?
    if (classes.videos.length > 0) {
      classes.videos.map(video => this.events.emit(
        coreEvents.entryRead,
        makeStandAlone.entry(video)
      ));
    }

    // Standalone voice-overs
    if (classes.audios.length > 0) {
      classes.audios.map(audio => this.events.emit(
        coreEvents.voiceOverDiscovered,
        makeStandAlone.voiceOver(audio)
      ));
    }

    // Standalone subtitles
    if (classes.subtitles.length > 0) {
      classes.subtitles.map(subtitles => this.events.emit(
        coreEvents.subtitlesDiscovered,
        makeStandAlone.subtitles(subtitles)
      ));
    }
  }
}

module.exports = FolderReader;
