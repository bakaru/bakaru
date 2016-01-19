import Promise from 'bluebird';
import { extname, sep } from 'path';
import fs from 'fs';

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

export default function classifyFolderItems (path, items) {
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
}

function classify (itemsStats) {
  const classes = {
    audios: [],
    videos: [],
    folders: [],
    subtitles: []
  };

  for (let [itemPath, itemStats] of itemsStats) {
    if (itemStats.isDirectory()) {
      classes.folders[classes.folders.length] = itemPath;
    } else {
      const itemExt = extname(itemPath).replace(/\./, '').toLowerCase();

      for (let [type, extensions] of extensionTypes) {
        if (extensions.indexOf(itemExt) > -1) {
          classes[type][classes[type].length] = itemPath;
        }
      }
    }
  }

  return classes;
}
