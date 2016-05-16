'use strict';

const bluebird = require('bluebird');
const readdir = require('fs').readdir;
const sha224 = require('js-sha256').sha224;
const _path = require('path');
const basename = _path.basename;
const extname = _path.extname;
const classifyFolderItems = require('./ItemsClassificator');

const readdirAsync = bluebird.promisify(readdir);

/**
 * @typedef {{id: string, title: string, episodesIds: string[]}} SubEntry
 */

class RecursiveAnimeFolderScanner {

  /**
   * @param {{dubs: SubEntry[], subs: SubEntry[]}} animeFolder
   * @param {string[]} folders
   * @returns {Promise}
   */
  scan(animeFolder, folders) {
    return Promise.all(folders.map(folderPath => {
      return readdirAsync(folderPath)
        .then(itemsNames => classifyFolderItems(folderPath, itemsNames))
        .then(classifiedItems => {
          switch (true) {
            case classifiedItems.folders.length > 0:
              return this.scan(animeFolder, classifiedItems.folders);
              break;

            case classifiedItems.audios.length > 0:
              return this._parseAndAddDub(animeFolder, folderPath, classifiedItems.audios);
              break;

            case classifiedItems.subtitles.length > 0:
              return this._parseAndAddSub(animeFolder, folderPath, classifiedItems.subtitles);
              break;

            default:
              return null;
              break;
          }
        })
    })).then(() => animeFolder);
  }

  /**
   * @param {{dubs: SubEntry[], subs: SubEntry[]}} animeFolder
   * @param {string} folderPath
   * @param {string[]} folderItems
   * @private
   */
  _parseAndAddDub(animeFolder, folderPath, folderItems) {
    const name = basename(folderPath);
    const path = folderPath;
    const id = sha224(name);

    animeFolder.dubs.push({
      id,
      name,
      path,
      episodes: this._folderItemsToPairs(folderItems)
    });
  }

  /**
   * @param {{dubs: SubEntry[], subs: SubEntry[]}} animeFolder
   * @param {string} folderPath
   * @param {string[]} folderItems
   * @private
   */
  _parseAndAddSub(animeFolder, folderPath, folderItems) {
    const name = basename(folderPath);
    const path = folderPath;
    const id = sha224(name);

    animeFolder.subs.push({
      id,
      name,
      path,
      episodes: this._folderItemsToPairs(folderItems)
    });
  }

  /**
   * @param {string[]} folderItems
   * @returns {[]}
   * @private
   */
  _folderItemsToPairs(folderItems) {
    return folderItems.map(itemPath => {
      return [
        sha224(basename(itemPath, extname(itemPath))),
        itemPath
      ];
    });
  }
}

module.exports = new RecursiveAnimeFolderScanner();
