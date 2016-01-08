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
  'vp9',
  '3gp'
]);
extensionTypes.set('subtitles', [
  'ass',
  'srt',
  'sub',
  'sbv'
]);

export default function getFolderItemsType (path, items) {
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

  return promise.then(itemsStats => guessType(itemsStats));
}

function guessType (itemsStats) {
  const itemsStatsMap = new Map(itemsStats);
  const folders = [];
  const itemTypeConductor = {
    audios: 0,
    videos: 0,
    folders: 0,
    subtitles: 0
  };

  for (let [itemPath, itemStats] of itemsStats) {
    if (itemStats.isDirectory()) {
      itemTypeConductor.folders++;
      folders[folders.length] = itemPath;
    } else {
      const itemExt = extname(itemPath).replace(/\./, '').toLowerCase();

      for (let [type, extensions] of extensionTypes) {
        if (extensions.indexOf(itemExt) > -1) {
          itemTypeConductor[type]++;
        }
      }
    }
  }

  return {
    types: itemTypeConductor,
    folders
  };
}
