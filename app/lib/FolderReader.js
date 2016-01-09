import { get as levenshtein } from 'fast-levenshtein';
import { sha224 } from 'js-sha256';
import naturalSort from 'javascript-natural-sort';

import classifyFolderItems from 'lib/FolderItemsClassificator';
import Promise from 'bluebird';
import { readdir } from 'fs';
import { sep, basename, extname } from 'path';

const readdirAsync = Promise.promisify(readdir);

export default class FolderReader {

  /**
   * @param {Function} addAnimeFolder
   * @param {Function} updateAnimeFolder
   */
  constructor(addAnimeFolder, updateAnimeFolder) {
    this.addAnimeFolder = addAnimeFolder;
    this.updateAnimeFolder = updateAnimeFolder;
  }

  /**
   * @param {String} path
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

        if (classifiedItems.videos.length > 0 && this.isAnimeFolder(classifiedItems)) {
          // So this is anime, good, fulfill it's data
          const animeFolder = this.makeAnimeFolderData(path, classifiedItems);

          this.addAnimeFolder(animeFolder);
        } else if (classifiedItems.folders.length > 0) {
          // Okay, we have some folders here, lets check'em all
          Promise.all(classifiedItems.folders.map(subPath => this.findAnime(subPath)))
            .catch(errors => {
              // So we catch here all errors from reading all sub folders
              // Dunno if we should do something with it :c
            });
        }
      })
  }

  /**
   * Detects if given folder is an anime
   *
   * @param {{folders: String[], videos: String[], subtitles: String[], audios: String[]}} classifiedItems
   * @returns {boolean}
   */
  isAnimeFolder(classifiedItems) {
    const videos = classifiedItems.videos.slice().sort(naturalSort);
    const videosLength = videos.length;
    const distances = [];
    const pairs = [];
    const percentile = .9;

    // TODO: Get rid of AB & BA distances duplication
    for (let i = 0; i < videosLength; i++) {
      for (let j = 0; j < videosLength; j++) {
        const compositeKey = `${i}${j}`;

        if (i === j || pairs.indexOf(compositeKey) > -1) {
          continue;
        }

        distances[distances.length] = levenshtein(videos[i], videos[j]);
      }
    }

    distances.sort((a, b) => a > b);
    const index = Math.round(distances.length * percentile) + 1;
    const mean = distances.slice(0, index).reduce((acc, n) => acc + n, 0) / index;

    // 90% times diff should be less than 3 symbols, that should be enough, huh?
    return mean < 3;
  }

  /**
   * Normalizes anime name as possible
   *
   * @param {String} path
   * @returns {String}
   */
  normalizeAnimeName(path) {
    let name = basename(path);

    // Get rid of [720p] and similar shit
    name = name.replace(/(\[.*?])/g, '');
    // Get rid of (720p) and similar shit
    name = name.replace(/(\(.*?\))/g, '');
    // Replace _. with space
    name = name.replace(/[_\.]/g, ' ');

    return name.trim();
  }

  /**
   * @param path
   * @returns {string}
   */
  getAnimeId(path) {
    return sha224(path);
  }

  /**
   * @param {String} path
   * @param {{}} classifiedItems
   * @returns {{id: string, name: String, path: *, dubs: Array, subs: Array, episodes: Array, state: {dubsLoading: boolean, subsLoading: boolean, episodesLoading: boolean}}}
   */
  makeAnimeFolderData(path, classifiedItems) {
    const animeFolder = {
      id: this.getAnimeId(path),
      name: this.normalizeAnimeName(path),
      path,
      dubs: [],
      subs: [],
      episodes: classifiedItems.videos.map(episode => ({
        id: this.getAnimeId(episode),
        name: episode,
        path: episode
      })),
      state: {
        dubsLoading: true,
        subsLoading: true,
        episodesLoading: true
      }
    };

    process.nextTick(() => {
      animeFolder.episodes = animeFolder.episodes.map(episode => {
        episode['ext'] = extname(episode.path);
        episode.name = this.normalizeAnimeName(basename(episode.path, episode.ext));
        episode.ext = episode.ext.replace(/\./, '').toLowerCase();

        return episode;
      });
      animeFolder.state.episodesLoading = false;

      this.updateAnimeFolder(animeFolder);
    });
    process.nextTick(() => {
      // TODO: Load subs and dubs
    });

    return animeFolder;
  }
}
