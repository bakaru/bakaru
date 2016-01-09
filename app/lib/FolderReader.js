import { get as levenshtein } from 'fast-levenshtein';
import { sha224 } from 'js-sha256';
import naturalSort from 'javascript-natural-sort';

import classifyFolderItems from 'lib/FolderItemsClassificator';
import Promise from 'bluebird';
import { readdir } from 'fs';
import { sep, basename, extname } from 'path';

const readdirAsync = Promise.promisify(readdir);

/**
 * @typedef {{folders: string[], videos: string[], subtitles: string[], audios: string[]}} ClassifiedItems
 * @typedef {{id: string, name: string, path: string: ext: string}} DubEntry
 * @typedef {{id: string, name: string, path: string: ext: string}} SubEntry
 * @typedef {{id: string, name: string, path: string: ext: string}} EpisodeEntry
 * @typedef {{dubsLoaded: boolean, subsLoaded: boolean, episodesLoaded: boolean}} AnimeFolderState
 * @typedef {{id: string, name: string, path: string, dubs: DubEntry[], subs: SubEntry[], episodes: EpisodeEntry[], state: AnimeFolderState}} AnimeFolder
 */
export default class FolderReader {

  /**
   * @callback addAnimeFolder
   * @callback updateAnimeFolder
   */
  constructor(addAnimeFolder, updateAnimeFolder) {
    this.addAnimeFolder = addAnimeFolder;
    this.updateAnimeFolder = updateAnimeFolder;
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
      episodes: classifiedItems.videos.map(episode => ({
        id: sha224(episode),
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
        episode.name = basename(episode.path, episode.ext);
        episode.ext = episode.ext.replace(/\./, '').toLowerCase();

        return episode;
      });

      const [sameStart, sameEnd] = findEqualStartAndEndParts(animeFolder.episodes.map(episode => episode.name));

      animeFolder.episodes.map(episode => {
        episode.name = episode.name.replace(sameStart, '').replace(sameEnd, '').trim();

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

/**
 * Detects if given folder is an anime
 *
 * @param {ClassifiedItems} classifiedItems
 * @returns {boolean}
 */
function isAnimeFolder(classifiedItems) {
  const videos = classifiedItems.videos.slice().sort(naturalSort);
  const videosLength = videos.length;
  const distances = [];
  const pairs = [];
  const percentile = .9;

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

/**
 * Returns equal start and end parts of all strings
 *
 * Given the strings ["w 1 e", "w 2 e", "w 3 2 4 e"] will return ["w ", " e"]
 *
 * @param {string[]} strings
 * @returns {[string, string]}
 */
function findEqualStartAndEndParts (strings) {
  const splittedStrings = strings.map(string => string.split(''));
  const stringsLength = strings.length;

  const firstStringLength = splittedStrings[0].length;

  // Start
  let start = [];

  for (let i = 0; i < firstStringLength; i++) {
    const letter = splittedStrings[0][i];

    let differenceDetected = false;

    for (let stringIndex = 1; stringIndex < stringsLength; stringIndex++) {
      if (splittedStrings[stringIndex][i] !== letter) {
        differenceDetected = true;
        break;
      }
    }

    if (!differenceDetected) {
      start[start.length] = letter;
    } else {
      break;
    }
  }

  // End
  let end = [];

  for (let j = 0; j < firstStringLength; j++) {
    const letter = splittedStrings[0][firstStringLength - 1 - j];

    let differenceDetected = false;

    for (let stringIndex = 1; stringIndex < stringsLength; stringIndex++) {
      const stringLength = splittedStrings[stringIndex].length;

      if (splittedStrings[stringIndex][stringLength - 1 - j] !== letter) {
        differenceDetected = true;
        break;
      }
    }

    if (!differenceDetected) {
      end = [letter].concat(end); // Like end.unshift(letter), but 98% faster. prooflink: https://github.com/loverajoel/jstips
    } else {
      break;
    }
  }

  return [start.join(''), end.join('')];
}