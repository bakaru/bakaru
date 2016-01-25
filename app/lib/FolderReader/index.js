import cache from 'lib/cache';
import Promise from 'bluebird';
import { sha224 } from 'js-sha256';
import thirdparty from 'lib/thirdparty';
import { readdir } from 'fs';
import { sep, basename, extname } from 'path';

import isAnimeFolder from './isAnimeFolder';
import findSameParts from './findSameParts';
import classifyFolderItems from './ItemsClassificator';
import RecursiveAnimeFolderScanner from './RecursiveAnimeFolderScanner';

const readdirAsync = Promise.promisify(readdir);

export default class FolderReader {

  /**
   * @callback addAnimeFolder
   * @callback updateAnimeFolder
   */
  constructor(addAnimeFolder, updateAnimeFolder) {
    this._addAnimeFolder = addAnimeFolder;
    this._updateAnimeFolder = updateAnimeFolder;
  }

  /**
   * @param {AnimeFolder} animeFolder
   */
  addAnimeFolder(animeFolder) {
    this._addAnimeFolder(animeFolder);
    cache.setAnimeFolder(animeFolder);
  }

  /**
   * @param {AnimeFolder} animeFolder
   */
  updateAnimeFolder(animeFolder) {
    this._updateAnimeFolder(animeFolder);
    cache.setAnimeFolder(animeFolder);
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
          const animeFolder = this.makeAnimeFolderData(path, classifiedItems);

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
  makeAnimeFolderData(path, classifiedItems) {
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
      selections: {
        dub: false,
        sub: false
      },
      episodeInfo: {},
      episodes: classifiedItems.videos.map(episode => ({
        id: sha224(episode),
        ext: '',
        name: '',
        path: episode,
        filename: ''
      })),
      state: {
        scanning: true
      }
    };

    process.nextTick(() => {
      this.refineEpisodesNames(animeFolder);
      this.updateAnimeFolder(animeFolder);
    });

    process.nextTick(() => {
      const firstEpisode = animeFolder.episodes[0];

      thirdparty.getMediaInfo(firstEpisode.path).then(info => {
        animeFolder.episodeInfo = info;
        this.updateAnimeFolder(animeFolder);
      });
    });

    RecursiveAnimeFolderScanner.scan(animeFolder, classifiedItems.folders)
      .finally(() => {
        animeFolder.state.scanning = false;
        this.updateAnimeFolder(animeFolder);
      });

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
      let [sameStart, sameEnd] = findSameParts(animeFolder.episodes.map(episode => episode.name));

      let from = sameStart.length;
      let to   = sameEnd.length;

      console.log(`Same start last char: ${sameStart}`);

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
