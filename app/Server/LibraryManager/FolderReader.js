'use strict';

const bluebird = require('bluebird');
const sha224 = require('js-sha256').sha224;
const readdir = require('fs').readdir;
const _path = require('path');
const events = require('../Server/events').renderer;
const basename = _path.basename;
const extname = _path.extname;
const normalize = _path.normalize;
const sep = _path.sep;

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
    this.skipMediaScanning = false;
    this.durationScanningQueue = [];
  }

  /**
   * Step by step goes through episodes duration scanning queue
   */
  processDurationScanningQueue() {
    const that = this;

    bluebird.coroutine(function* () {
      const queueLength = that.durationScanningQueue.length;

      for (let i = 0; i < queueLength; i++) {
        yield that.durationScanningQueue[i]();
      }
    })();
  }

  /**
   * Set sender
   *
   * @param sender
   */
  setSender(sender) {
    this.send = sender;
  }

  /**
   * @param {string} path
   * @returns {Promise.<T>}
   */
  findAnime(path) {
    const that = this;

    return bluebird.coroutine(function* () {
      const dirchunks = normalize(path).split(sep);
      const dirname = normalizeTitle(dirchunks[dirchunks.length-1]);
      const itemsNames = yield readdirAsync(path);
      const classifiedItems = yield classifyFolderItems(path, itemsNames);

      if ((classifiedItems.videos.length + classifiedItems.folders.length) === 0) {
        // So this folder contains nor anime neither folders, WTF?
        throw new Error(`${path}, no folders or videos found, are you sure you pick correct folder?`);
      }

      if (classifiedItems.videos.length > 0 && isAnimeFolder(classifiedItems, dirname)) {
        // So this is anime, good, fulfill it's data
        that.makeAnimeFolder.apply(that, [path, classifiedItems]);

        return Promise.resolve(true);
      } else if (classifiedItems.folders.length > 0) {
        // Okay, we have some folders here, lets check'em all
        return Promise.all(classifiedItems.folders.map(subPath => that.findAnime.apply(that, [subPath]))).catch(()=>{});
      }
    })().then(_ => this.processDurationScanningQueue());
  }

  /**
   * @param {string} path
   * @param {ClassifiedItems} classifiedItems
   */
  makeAnimeFolder(path, classifiedItems) {
    const id = sha224(path);
    const title = normalizeTitle(path);

    // Sending anime stub
    this.send(events.addAnimeFolder, { id, title, path });

    const episodesStubs = this.makeEpisodes(classifiedItems.videos);

    // Sending episodes stubs
    this.send(events.addEpisodes, { id, episodesStubs });

    // Enqueueing episodes duration scanning
    console.log(`Enqueueing entry:${id} episodes scanning`);
    this.durationScanningQueue.push(() => {
      console.log(`Scanning entry:${id}`);

      return this.mediaInfo
        .getDuration(episodesStubs.map(_ => _.path))
        .then(_ => _.map((duration, index) => {
          this.send(events.updateEpisode, { id, episodeStub: Object.assign({}, episodesStubs[index], { duration }) });
        }));
    }); 

    // Sending subs scanning started
    this.send(events.startSubsScanning, id);

    RecursiveAnimeFolderScanner.scan({ dubs: [], subs: [] }, classifiedItems.folders)
      .then(animeFolder => {
        if (animeFolder.dubs.length > 0) {
          // Sending external dubs
          this.send(events.updateDubs, { id, dubsStubs: animeFolder.dubs });
        }

        if (animeFolder.subs.length > 0) {
          // Sending external subs
          this.send(events.updateSubs, { id, subsStubs: animeFolder.subs });
        }

        // Sending subs scanning done
        this.send(events.stopSubsScanning, id);
      });

    if (!this.skipMediaScanning) {
      new MediaScanner(
        id,
        title,
        episodesStubs,
        this.send,
        this.mediaInfo
      );
    }

    // Sending main scanning done
    this.send(events.stopScanning, id);
  }

  /**
   * Makes episodes objects
   *
   * @param {string[]} episodesPaths
   * @returns {{id: string, ext: string, title: string, path: string, filename: string}[]}
   */
  makeEpisodes(episodesPaths) {
    let episodes = episodesPaths.map(episodePath => {
      const originalExt = extname(episodePath);

      const ext = originalExt.replace('.', '').toLowerCase();
      const title = basename(episodePath, extname(episodePath));
      const filename = basename(episodePath);
      const id = sha224(title);

      return {
        id,
        ext,
        path: episodePath,
        title,
        filename
      };
    });

    if (episodes.length > 1) {
      const sameParts = findSameParts(episodes.map(episode => episode.title));
      let sameStart = sameParts[0];
      let sameEnd = sameParts[1];

      let from = sameStart.length;
      let to   = sameEnd.length;

      if (isNaN(+sameStart[from - 1]) === false) { // check if last char is a digit
        from--;
      }

      episodes = episodes.map(episode => {
        episode.title = episode.title.slice(from, episode.title.length - to).trim();

        return episode;
      });
    }

    return episodes;
  }
}

module.exports = FolderReader;

/**
 * Normalizes anime name as possible
 *
 * @param {string} path
 * @returns {string}
 */
function normalizeTitle(path) {
  let name = basename(path);

  // Get rid of [720p] and similar shit
  name = name.replace(/(\[.*?])/g, '');
  // Get rid of (720p) and similar shit
  name = name.replace(/(\(.*?\))/g, '');
  // Replace _. with space
  name = name.replace(/[_\.]/g, ' ');

  return name.trim();
}