import extensionsTypes from './extensionTypes';
import * as bluebird from 'bluebird';
import * as path from 'path';
import * as originFs from 'fs';

const statAsync = bluebird.promisify(originFs.stat);

/**
 * Makes new classes object
 *
 * @returns {ClassifiedFolderItems}
 */
function makeClasses(): ClassifiedFolderItems {
  return {
    audios: [],
    videos: [],
    series: [],
    folders: [],
    subtitles: []
  };
}

interface ItemStats {
  item: string
  stats: originFs.Stats
}

/**
 * Stats all items
 *
 * @param {string[]} items
 * @returns {Promise<{item: string, stats: originFs.Stats}[]>}
 */
function statItems(items: string[]): Promise<ItemStats[]> {
  return Promise.all<ItemStats>(items.map(item => statAsync(item).then(stats => ({item, stats}))));
}

/**
 * Classifies folder items
 *
 * @param {string[]} items
 * @returns {Promise<ClassifiedFolderItems>}
 */
export default async function classify(items: string[]): Promise<ClassifiedFolderItems> {
  const classes = makeClasses();

  const itemsStats = await statItems(items);

  for (let i = 0, len = itemsStats.length; i < len; i++) {
    const { item, stats } = itemsStats[i];

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
    }
  }

  return classes;
}
