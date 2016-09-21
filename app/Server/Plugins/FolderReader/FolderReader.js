const coreObjectsCreators = require('../coreObjectsCreators');
const coreEvents = require('../coreEvents');
const bluebird = require('bluebird');
const path = require('path');
const fs = bluebird.promisifyAll(require('fs'));

const classify = require('./classify');
const isSeries = require('./isSeries');

/**
 * Expands series folder
 *
 * @param {string} seriesPath
 * @param {ClassifiedFolderItems} classes
 */
function makeSeriesEntry(seriesPath, classes) {
  return coreObjectsCreators.entry(seriesPath);
}

function makeSeriesVoiceOver(voiceOverPath, items) {

}

function makeSeriesSubtitles(subtitlesPath, items) {

}

function makeSingleEntry(entryPath) {

}

function makeSingleVoiceOver(audioPath) {

}

function makeSingleSubtitles(subtitlesPath) {

}

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

    fs.stat(normalizedPath)
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
    return fs.readdirAsync(folderPath)
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
    this.events.emit(
      coreEvents.entryDiscovered,
      makeSeriesEntry(seriesPath, classes)
    );
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
        coreEvents.entryDiscovered,
        makeSingleEntry(video)
      ));
    }

    // Standalone voice-overs
    if (classes.audios.length > 0) {
      classes.audios.map(audio => this.events.emit(
        coreEvents.voiceOverDiscovered,
        makeSingleVoiceOver(audio)
      ));
    }

    // Standalone subtitles
    if (classes.subtitles.length > 0) {
      classes.subtitles.map(subtitles => this.events.emit(
        coreEvents.subtitlesDiscovered,
        makeSingleSubtitles(subtitles)
      ));
    }
  }
}

module.exports = FolderReader;
