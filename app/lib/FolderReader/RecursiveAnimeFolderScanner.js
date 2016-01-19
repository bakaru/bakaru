import { readdir } from 'fs';
import Promise from 'bluebird';
import { sha224 } from 'js-sha256';
import { sep, basename, extname } from 'path';
import classifyFolderItems from './ItemsClassificator';

const readdirAsync = Promise.promisify(readdir);

class RecursiveAnimeFolderScanner {

  /**
   * @param {AnimeFolder} animeFolder
   * @param {string[]} folders
   * @returns {Promise}
   */
  scan (animeFolder, folders) {
    return Promise.all(folders.map(folderPath => {
      readdirAsync(folderPath)
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

            case classifiedItems.videos.length > 0:
              return this._parseAndAddBonuses(animeFolder, folderPath, classifiedItems.videos);
              break;

            default:
              return null;
              break;
          }
        })
    }));
  }

  /**
   * @param {AnimeFolder} animeFolder
   * @param {string} folderPath
   * @param {string[]} folderItems
   * @private
   */
  _parseAndAddDub (animeFolder, folderPath, folderItems) {
    const name = basename(folderPath);
    const path = folderPath;
    const id = sha224(name);

    animeFolder.dubs.push({
      id,
      name,
      path
    });
  }

  /**
   * @param {AnimeFolder} animeFolder
   * @param {string} folderPath
   * @param {string[]} folderItems
   * @private
   */
  _parseAndAddSub (animeFolder, folderPath, folderItems) {
    const name = basename(folderPath);
    const path = folderPath;
    const id = sha224(name);

    animeFolder.subs.push({
      id,
      name,
      path
    });
  }

  /**
   * @param {AnimeFolder} animeFolder
   * @param {string} folderPath
   * @param {string[]} folderItems
   * @private
   */
  _parseAndAddBonuses (animeFolder, folderPath, folderItems) {
    const name = basename(folderPath);
    const path = folderPath;
    const id = sha224(name);

    animeFolder.bonuses.push({
      id,
      name,
      path
    });
  }
}

export default new RecursiveAnimeFolderScanner();