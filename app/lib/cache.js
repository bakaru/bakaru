'use strict';

const Promise = require('bluebird');
const _fs = require('fs');
const writeFile = _fs.writeFile;
const readFile = _fs.readFile;
const readdir = _fs.readdir;
const sep = require('path').sep;
const path = require('./path');
const renderer = require('./events').renderer;

const writeFileAsync = Promise.promisify(writeFile);
const readFileAsync = Promise.promisify(readFile);
const readdirAsync = Promise.promisify(readdir);

class Cache {
  constructor() {
    this.animeFolders = new Map();
  }

  getAnimeFolderPath(animeFolderId) {
    return path.cache.animeFolders + sep + animeFolderId + '.json';
  }

  /**
   * @param {AnimeFolder} animeFolder
   */
  setAnimeFolder(animeFolder) {
    this.animeFolders.set(animeFolder.id, animeFolder);
  }

  restore(sendTo) {
    readdirAsync(path.cache.animeFolders).then(items => {
      if (items === null || items.length === 0) {
        return null;
      }

      items.map(item => {
        const filePath = path.cache.animeFolders + sep + item;

        readFileAsync(filePath).then(animeFolderJson => {
          const animeFolder = JSON.parse(animeFolderJson);
          this.setAnimeFolder(animeFolder);
          sendTo.send(renderer.addAnimeFolder, animeFolder);
        });
      });
    });
  }

  flush() {
    const promises = [];

    for (let animeFolder of this.animeFolders.values()) {
      const filePath = this.getAnimeFolderPath(animeFolder.id);
      const jsonAnimeFolder = JSON.stringify(animeFolder);

      promises[promises.length] = writeFileAsync(filePath, jsonAnimeFolder);
    }

    return Promise.all(promises);
  }
}

const cache = new Cache();

module.exports = cache;