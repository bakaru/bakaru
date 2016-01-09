import { get as levenshtein } from 'fast-levenshtein';
import naturalSort from 'javascript-natural-sort';

import classifyFolderItems from 'lib/FolderItemsClassificator';
import Promise from 'bluebird';
import { readdir } from 'fs';
import { sep } from 'path';

const readdirAsync = Promise.promisify(readdir);

export default class FolderReader {
  constructor (sendFolderRead) {
    this.sendFolderRead = sendFolderRead;
  }

  read (path) {
    let animeFolders = new Map();

    readdirAsync(path)
      .then(itemsNames => classifyFolderItems(path, itemsNames))
      .then(classifiedItems => {
        if ((classifiedItems.videos.length + classifiedItems.folders.length) === 0) {
          // So this folder contains nor anime neither folders, WTF?
          console.log(`Found nothing interesting in ${path}`);
        }

        if (classifiedItems.videos.length > 0 && this.isAnimeFolder(classifiedItems)) {
          // So this is anime, good, fulfill it's data
          animeFolders.set(path, this.makeAnimeFolderData(path, classifiedItems));
        }

        if (classifiedItems.folders.length > 0) {
          // Okay, we have some folders here, lets check'em all
          // TODO: recursively run FolderReader.read on every subfolder
        }

        return animeFolders;
      })
      .then(animeFolders => {
        this.sendFolderRead({
          path,
          folders: [...animeFolders.entries()]
        });
      });
  }

  isAnimeFolder (classifiedItems) {
    const videos = classifiedItems.videos.slice().sort(naturalSort);
    const videosLength = videos.length;
    const distances = [];
    const percentile = .9;

    // TODO: Get rid of AB & BA distances duplication
    for (let i = 0; i < videosLength; i++) {
      for (let j = 0; j < videosLength; j++) {
        if (i === j) {
          continue;
        }

        distances[distances.length] = levenshtein(videos[i], videos[j]);
      }
    }

    distances.sort((a, b) => a > b);
    const index = Math.round(distances.length * percentile) + 1;
    const mean = distances.slice(0, index).reduce((acc, n) => acc+n, 0) / index;

    // 90% times diff should be less than 3 symbols, that should be enough, huh?
    return mean < 3;
  }

  normalizeAnimeName (path) {
    // TODO: Actually normalize anime name
    return path;
  }

  makeAnimeFolderData (path, classifiedItems) {
    // TODO: FULFILLMENT MOTHERFUCKER DO YA DO IT?!
    return {
      path,
      classifiedItems
    };
  }
}
