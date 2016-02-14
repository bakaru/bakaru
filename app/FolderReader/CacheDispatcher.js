'use strict';

const Promise = require('bluebird');
const _fs = require('fs');
const writeFile = _fs.writeFile;
const readFile = _fs.readFile;
const readdir = _fs.readdir;
const sep = require('path').sep;

const writeFileAsync = Promise.promisify(writeFile);
const readFileAsync = Promise.promisify(readFile);
const readdirAsync = Promise.promisify(readdir);

class Cache {

  /**
   * @param {PathDispatcher} pathDispatcher
   * @param {{main:{}, renderer:{}}} events
   */
  constructor(pathDispatcher, events) {
    this.pathDispatcher = pathDispatcher;
    this.events = events;
    this.animeFolders = new Map();
  }

  getAnimeFolderPath(animeFolderId) {
    return this.pathDispatcher.cache.animeFolders + sep + animeFolderId + '.json';
  }

  /**
   * @param {AnimeFolder} animeFolder
   */
  setAnimeFolder(animeFolder) {
    this.animeFolders.set(animeFolder.id, animeFolder);
  }

  /**
   * Restores cahced data
   *
   * @param sendTo
   */
  restore(sendTo) {
    readdirAsync(this.pathDispatcher.cache.animeFolders).then(items => {
      if (items === null || items.length === 0) {
        return null;
      }

      items.map(item => {
        const filePath = this.pathDispatcher.cache.animeFolders + sep + item;

        readFileAsync(filePath).then(animeFolderJson => {
          const animeFolder = JSON.parse(animeFolderJson);
          this.setAnimeFolder(animeFolder);
          sendTo.send(this.events.renderer.addAnimeFolder, animeFolder);
        });
      });
    });
  }

  /**
   * Flushes all content to FS
   *
   * @returns {Promise}
   */
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

module.exports = Cache;
