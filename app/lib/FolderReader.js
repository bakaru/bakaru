import { readdir } from 'fs';
import Promise from 'bluebird';
import { sha224 } from 'js-sha256';
import { sep, basename, extname } from 'path';
import naturalSort from 'javascript-natural-sort';
import cache from 'lib/cache';
import { get as levenshtein } from 'fast-levenshtein';
import classifyFolderItems from 'lib/FolderItemsClassificator';
import getInfo, { setThirdPartyDir } from 'lib/thirdparty/MediaInfo';

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
      animeFolder.episodes = animeFolder.episodes.map(episode => {
        const originalExt = extname(episode.path);

        episode.ext = originalExt.replace('.', '').toLowerCase();
        episode.name = basename(episode.path, `.${originalExt}`);
        episode.filename = basename(episode.path);

        return episode;
      });

      const [sameStart, sameEnd] = findEqualStartAndEndParts(animeFolder.episodes.map(episode => episode.name));

      console.log(sameStart, sameEnd);

      animeFolder.episodes = animeFolder.episodes.map(episode => {
        episode.name = episode.filename.replace(sameStart, '').replace(sameEnd, '').trim();

        return episode;
      });

      this.updateAnimeFolder(animeFolder);
    });

    process.nextTick(() => {
      const firstEpisode = animeFolder.episodes[0];

      getInfo(firstEpisode.path).then(info => {
        animeFolder.episodeInfo = info;
        this.updateAnimeFolder(animeFolder);
      });
    });

    this.recursivelyScanAnimeFolder(animeFolder, classifiedItems.folders)
      .finally(() => {
        animeFolder.state.scanning = false;
        this.updateAnimeFolder(animeFolder);
      });

    return animeFolder;
  }

  /**
   * @param {AnimeFolder} animeFolder
   * @param {string[]} folders
   * @returns {Promise}
   */
  recursivelyScanAnimeFolder (animeFolder, folders) {
    return Promise.all(folders.map(folderPath => {
      readdirAsync(folderPath)
        .then(itemsNames => classifyFolderItems(folderPath, itemsNames))
        .then(classifiedItems => {
          switch (true) {
            case classifiedItems.folders.length > 0:
              return this.recursivelyScanAnimeFolder(animeFolder, classifiedItems.folders);
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

    this.updateAnimeFolder(animeFolder);
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

    this.updateAnimeFolder(animeFolder);
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

    this.updateAnimeFolder(animeFolder);
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
      } else {
        pairs[pairs.length] = compositeKey;
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
  const stringsLength = strings.length;

  if (stringsLength === 1) {
    return ['', ''];
  }

  const firstStringLength = strings[0].length;

  // Start
  let start = [];

  for (let i = 0; i < firstStringLength; i++) {
    const letter = strings[0][i];

    let differenceDetected = false;

    for (let stringIndex = 1; stringIndex < stringsLength; stringIndex++) {
      if (strings[stringIndex][i] !== letter) {
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
    const letter = strings[0][firstStringLength - 1 - j];

    let differenceDetected = false;

    for (let stringIndex = 1; stringIndex < stringsLength; stringIndex++) {
      const stringLength = strings[stringIndex].length;

      if (strings[stringIndex][stringLength - 1 - j] !== letter) {
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
