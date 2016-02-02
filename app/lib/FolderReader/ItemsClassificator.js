'use strict';

const _path = require('path');
const extname = _path.extname;
const sep = _path.sep;
const fs = require('fs');

const extensionTypes = new Map();

extensionTypes.set('audios', [
  'mka',
  'aac',
  'ac3',
  'flac',
  'mp3',
  'ogg'
]);
extensionTypes.set('videos', [
  'mkv',
  'mp4',
  'avi',
  'mpeg',
  'mov',
  'webm',
  '3gp'
]);
extensionTypes.set('subtitles', [
  'mks',
  'ass',
  'srt',
  'sub',
  'sbv'
]);

/**
 * @param {string} path
 * @param {[]} items
 * @returns {Promise.<T>}
 */
module.exports = function classifyFolderItems (path, items) {
  const itemsStatsPromises = [];
  items.map(itemName => {
    const itemPath = [path, itemName].join(sep);

    itemsStatsPromises[itemsStatsPromises.length] = new Promise((resolve, reject) => {
      fs.stat(itemPath, (err, stats) => {
        if (err) {
          reject(err);
        } else {
          resolve([itemPath, stats]);
        }
      });
    });
  });
  const promise = Promise.all(itemsStatsPromises);

  return promise.then(itemsStats => classify(itemsStats));
};

/**
 * @param itemsStats
 * @returns {{audios: Array, videos: Array, folders: Array, subtitles: Array}}
 */
function classify (itemsStats) {
  const classes = {
    audios: [],
    videos: [],
    folders: [],
    subtitles: []
  };

  for (let entry of itemsStats) {
    const itemPath = entry[0];
    const itemStats = entry[1];

    if (itemStats.isDirectory()) {
      classes.folders[classes.folders.length] = itemPath;
    } else {
      const itemExt = extname(itemPath).replace(/\./, '').toLowerCase();

      for (let entry2 of extensionTypes) {
        const type = entry2[0];
        const extensions = entry2[1];

        if (extensions.indexOf(itemExt) > -1) {
          classes[type][classes[type].length] = itemPath;
        }
      }
    }
  }

  return classes;
}
