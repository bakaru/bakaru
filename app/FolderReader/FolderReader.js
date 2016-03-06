'use strict';

const sha224 = require('js-sha256').sha224;
const readdir = require('fs').readdir;
const _path = require('path');
const basename = _path.basename;
const extname = _path.extname;

const isAnimeFolder = require('./isAnimeFolder');
const findSameParts = require('./findSameParts');
const classifyFolderItems = require('./ItemsClassificator');
const MediaScanner = require('./MediaScanner');
const RecursiveAnimeFolderScanner = require('./RecursiveAnimeFolderScanner');

const readdirAsync = require('bluebird').promisify(readdir);

class FolderReader {

  /**
   * @param {App} app
   */
  constructor(app) {
    this.mediaInfo = app.mediaInfo;
  }

  /**
   * @callback addAnimeFolder
   * @callback updateAnimeFolder
   * @returns void
   */
  setHandlers(addAnimeFolder, updateAnimeFolder) {
    this._addAnimeFolder = addAnimeFolder;
    this._updateAnimeFolder = updateAnimeFolder;
  }

  /**
   * @param {AnimeFolder} animeFolder
   */
  addAnimeFolder(animeFolder) {
    this._addAnimeFolder(animeFolder);
  }

  /**
   * @param {AnimeFolder} animeFolder
   */
  updateAnimeFolder(animeFolder) {
    this._updateAnimeFolder(animeFolder);
  }

  /**
   * @param {string} path
   * @returns {Promise.<T>}
   */
  findAnime(path) {
    return readdirAsync(path)
      .then(itemsNames => classifyFolderItems(path, itemsNames))
      .then(classifiedItems => {
        if ((classifiedItems.videos.length + classifiedItems.folders.length) === 0) {
          // So this folder contains nor anime neither folders, WTF?
          console.log(`Found nothing interesting in ${path}`);
          throw new Error(`${path}, no folders or videos found, are you sure you pick correct folder?`);
        }

        if (classifiedItems.videos.length > 0 && isAnimeFolder(classifiedItems)) {
          // So this is anime, good, fulfill it's data
          const animeFolder = this.makeAnimeFolder(path, classifiedItems);

          this.addAnimeFolder(animeFolder);

          return true;
        } else if (classifiedItems.folders.length > 0) {
          // Okay, we have some folders here, lets check'em all
          return Promise.all(classifiedItems.folders.map(subPath => this.findAnime(subPath)))
            .catch(errors => {
              // So we catch here all errors from reading all sub folders
              // Dunno if we should do something with it :c
            });
        }
      })
  }

  /**
   * @param {string} path
   * @param {ClassifiedItems} classifiedItems
   * @returns {AnimeFolder}
   */
  makeAnimeFolder(path, classifiedItems) {
    /**
     * @type {AnimeFolder}
     */
    const animeFolder = {
      id: sha224(path),
      name: normalizeAnimeName(path),
      path,
      dubs: [],
      subs: [],
      bonuses: [],
      quality: "unknown",
      media: {
        width: 0,
        height: 0,
        bitDepth: 8,
        format: ''
      },
      episodes: classifiedItems.videos.map(episode => ({
        id: sha224(episode),
        ext: '',
        name: '',
        path: episode,
        filename: '',
        duration: ''
      })),
      state: {
        scanning: true,
        subScanning: true,
        mediainfoScanning: true
      }
    };

    this.refineEpisodesNames(animeFolder);

    RecursiveAnimeFolderScanner.scan(animeFolder, classifiedItems.folders)
      .then(() => {
        animeFolder.state.scanning = false;
        animeFolder.state.subScanning = false;

        this.updateAnimeFolder(animeFolder);
      });

    new MediaScanner(animeFolder, this.updateAnimeFolder.bind(this), this.mediaInfo);

    return animeFolder;
  }

  /**
   * @param {AnimeFolder} animeFolder
   */
  refineEpisodesNames(animeFolder) {
    animeFolder.episodes = animeFolder.episodes.map(episode => {
      const originalExt = extname(episode.path);

      episode.ext = originalExt.replace('.', '').toLowerCase();
      episode.name = basename(episode.path, `.${originalExt}`);
      episode.filename = basename(episode.path);

      return episode;
    });

    if (animeFolder.episodes.length > 1) {
      const sameParts = findSameParts(animeFolder.episodes.map(episode => episode.name));
      let sameStart = sameParts[0];
      let sameEnd = sameParts[1];

      let from = sameStart.length;
      let to   = sameEnd.length;

      if (isNaN(+sameStart[from - 1]) === false) { // check if last char is a digit
        from--;
      }

      animeFolder.episodes = animeFolder.episodes.map(episode => {
        episode.name = episode.filename.slice(from, episode.filename.length - to).trim();

        return episode;
      });
    }
  }
}

module.exports = FolderReader;

/**
 * Normalizes anime name as possible
 *
 * @param {string} path
 * @returns {string}
 */
function normalizeAnimeName(path) {
  let name = basename(path);

  // Get rid of [720p] and similar shit
  name = name.replace(/(\[.*?])/g, '');
  // Get rid of (720p) and similar shit
  name = name.replace(/(\(.*?\))/g, '');
  // Replace _. with space
  name = name.replace(/[_\.]/g, ' ');

  return name.trim();
}
