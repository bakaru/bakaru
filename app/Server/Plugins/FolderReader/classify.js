const extensionsTypes = require('./extensionsTypes');
const bluebird = require('bluebird');
const path = require('path');
const fs = bluebird.promisifyAll(require('fs'));

/**
 * Makes new classes object
 *
 * @returns {ClassifiedFolderItems}
 */
function makeClasses() {
  return {
    audios: [],
    videos: [],
    series: [],
    folders: [],
    subtitles: []
  }
}

/**
 * Stats all items
 *
 * @param {string[]} items
 * @returns {Promise<{item: string, stats: fs.Stats}[]>}
 */
function statItems(items) {
  return Promise.all(items.map(item => fs.stat(item).then(stats => ({item, stats}))));
}

/**
 * Classifies folder items
 *
 * @param {string[]} items
 * @returns {Promise<ClassifiedFolderItems>}
 */
function classify(items) {
  const classes = makeClasses();

  return statItems(items).then(itemsStats => itemsStats.map(({item, stats}) => {
    const itemExtension = path.extname(item).slice(1).toLowerCase();

    switch (true) {
      case stats.isDirectory():
        classes.folders.push(item);
        break;

      case extensionsTypes.audio.has(itemExtension):
        classes.audios.push(item);
        break;

      case extensionsTypes.video.has(itemExtension):
        classes.videos.push(item);
        break;

      case extensionsTypes.subtitles.has(itemExtension):
        classes.subtitles.push(item);
        break;

      default:
        return;
    }
  })).then(() => classes);
}

module.exports = classify;
