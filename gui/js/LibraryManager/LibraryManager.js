import * as actions from 'actions';
import { ipcRenderer } from 'electron';
import { renderer } from 'ipc-events';
import LibraryEvents from 'utils/LibraryEvents';
import ARSON from 'arson';

const debug = false;

/**
 * @typedef {{
  * id: string,
  * title: string,
  * path: string,
  * dubs: Map,
  * subs: Map,
  * bonuses: Map,
  * episodes: Map,
  * quality: string,
  * width: number,
  * height: number,
  * bitDepth: number,
  * format: string,
  * watched: number,
  * state: {scanning: boolean, subScanning: boolean, mediainfoScanning: boolean}
  * }} Anime
 */

function getAnimeTemplate () {
  return {
    id: '',
    title: '',
    path: '',
    dubs: new Map(),
    subs: new Map(),
    bonuses: new Map(),
    episodes: new Map(),
    quality: "unknown",
    width: 0,
    height: 0,
    bitDepth: 8,
    format: '',
    watched: 0,
    links: {
      mal: {
        id: '',
        score: '',
        poster: '',
        episodesTotal: 0,
        episodesSeen: 0
      }
    },
    state: {
      scanning: true,
      subScanning: true,
      mediainfoScanning: true
    }
  };
}

/**
 * @typedef {{id: string, title: string, path: string, episodes: Map.<string, string>}} Dub
 */
function getDubTemplate () {
  return {
    id: '',
    title: '',
    path: '',
    episodes: new Map(),
    embedded: false,
    embeddedIndex: -1,
    embeddedStreamIndex: -1
  };
}

/**
 * @typedef {{id: string, title: string, path: string, episodes: Map.<string, string>}} Sub
 */
function getSubTemplate () {
  return {
    id: '',
    title: '',
    path: '',
    episodes: new Map(),
    embedded: false,
    embeddedIndex: -1,
    embeddedStreamIndex: -1
  };
}

/**
 * @typedef {{id: string, ext: string, title: string, path: string, filename: string, duration: number|boolean, stoppedAt: number|boolean}} Episode
 */
function getEpisodeTemplate () {
  return {
    id: '',
    ext: '',
    title: '',
    path: '',
    filename: '',
    duration: false,
    stoppedAt: false,
    watched: false
  };
}

export default class LibraryManager {
  constructor () {
    this.store = null;

    this.cacheThrottler = null;

    /**
     * @type {Set.<string>}
     */
    this.entriesIds = new Set();
    /**
     * @type {Map.<string, Anime>}
     */
    this.library = this._restoreCache();

    this._setupEventsHandlers();
  }

  setStore (store) {
    this.store = store;
  }

  /**
   * Restores cache
   *
   * @return {Map.<string, Anime>}
   * @private
   */
  _restoreCache () {
    const entries = new Map();

    if (typeof window.localStorage['library'] !== 'undefined') {
      this.entriesIds = new Set(JSON.parse(window.localStorage['library']));

      for (let entryId of this.entriesIds) {
        entries.set(entryId, ARSON.parse(window.localStorage[entryId]));
      }
    }

    return entries;
  }

  /**
   * Updates cached entry
   *
   * @param {Anime} entry
   */
  updateCache (entry) {
    window.clearTimeout(this.cacheThrottler);

    this.cacheThrottler = window.setTimeout(() => {
      window.localStorage['library'] = JSON.stringify([...this.entriesIds.add(entry.id)]);
    }, 200);

    window.localStorage[entry.id] = ARSON.stringify(entry);
  }

  openSelectFolderDialog () {
    return () => {
      ipcRenderer.send('main:openSelectFolderDialog');
    };
  }
  
  getLibrary () {
    return this.library;
  }

  _setupEventsHandlers () {
    LibraryEvents.onResurrect(entries => {
      debug && console.log(`[LM] Library resurrected`);

      this.library = new Map(entries);
    });

    LibraryEvents.onStopped(({ entryId, episodeId, time }) => {
      debug && console.log(`[LM] Stopping at ${time}`, entryId, episodeId);

      this.store.dispatch(actions.updateAnimeFolder(this.handleStoppedAt(entryId, episodeId, time)));
    });
  }

  handleStoppedAt (id, episodeId, time) {
    const anime = this.getAnime(id);
    const episodesMap = new Map(anime.episodes);
    const episode = episodesMap.get(episodeId) || getEpisodeTemplate();

    if (episode.duration) {
      episode.stoppedAt = time;

      if (!episode.watched && (episode.stoppedAt / episode.duration) >= .9) {
        episode.watched = true;
        anime.watched++;
      }
    }

    episodesMap.set(
      episodeId,
      episode
    );

    anime.episodes = episodesMap;

    return anime;
  }

  stopScanning (id) {
    debug && console.log('LM:stopScanning', id);

    const anime = this.getAnime(id);

    anime.state.scanning = false;

    return anime;
  }

  startSubsScanning (id) {
    debug && console.log('LM:startSubsScanning', id);

    const anime = this.getAnime(id);

    anime.state.subScanning = true;

    return anime;
  }

  stopSubsScanning (id) {
    debug && console.log('LM:stopSubsScanning', id);

    const anime = this.getAnime(id);

    anime.state.subScanning = false;

    return anime;
  }

  startMediaInfoScanning (id) {
    debug && console.log('LM:startMediaInfoScanning', id);

    const anime = this.getAnime(id);

    anime.state.mediainfoScanning = true;

    return anime;
  }

  stopMediaInfoScanning (id) {
    debug && console.log('LM:stopMediaInfoScanning', id);

    const anime = this.getAnime(id);

    anime.state.mediainfoScanning = false;

    return anime;
  }

  /**
   * Create new anime entry
   *
   * @param {{id: string, title: string, path: string}} animeStub
   * @returns {Anime}
   */
  create (animeStub) {
    debug && console.log('LM:create', animeStub);

    let anime = this.getAnime(animeStub.id);

    if (anime) {
      anime.state.scanning = true;

      return anime;
    }

    anime = Object.assign({}, getAnimeTemplate(), animeStub);

    this.library.set(animeStub.id, anime);

    return anime;
  }

  /**
   * Sets anime media info
   *
   * @param {string} id
   * @param {{width: number, height: number, bitDepth: number, format: string}} mediaInfo
   */
  setMediaInfo ({ id, mediaInfo }) {

    const anime = this.getAnime(id);

    if (mediaInfo.width < 1000) {
      mediaInfo.quality = 'SD';
    } else {
      mediaInfo.quality = 'HD';
    }

    mediaInfo.quality += ` ${mediaInfo.width}x${mediaInfo.height}`;
    debug && console.log('LM:setMediaInfo', anime, id, mediaInfo);

    return Object.assign(anime, mediaInfo);
  }

  /**
   * Add episodes
   *
   * @param {string} id
   * @param {{id: string, title: string, path: string, filename: string}[]} episodesStubs
   * @returns {Anime}
   */
  addEpisodes ({ id, episodesStubs }) {
    debug && console.log('LM:addEpisodes', id, episodesStubs);

    const anime = this.getAnime(id);
    const episodesMap = new Map(anime.episodes);

    episodesStubs.map(episodeStub => {
      if (episodesMap.has(episodeStub.id)) {
        return;
      }

      const episode = Object.assign({}, getEpisodeTemplate(), episodeStub);

      episodesMap.set(episode.id, episode);
    });

    anime.episodes = episodesMap;

    return anime;
  }

  /**
   * Update episode
   *
   * @param {string} id
   * @param {Episode} episodeStub
   * @returns {Anime}
   */
  updateEpisode ({ id, episodeStub }) {
    debug && console.log('LM:updateEpisode', id, episodeStub);

    const anime = this.getAnime(id);
    const episodesMap = new Map(anime.episodes);

    episodesMap.set(
      episodeStub.id,
      Object.assign({}, episodesMap.get(episodeStub.id) || getEpisodeTemplate(), episodeStub)
    );

    anime.episodes = episodesMap;

    return anime;
  }

  /**
   * Update dubs
   *
   * @param {string} id
   * @param {Dub[]} dubsStubs
   * @returns {Anime}
   */
  updateDubs ({ id, dubsStubs }) {
    debug && console.log('LM:updateDubs', id, dubsStubs);

    const anime = this.getAnime(id);
    const dubsMap = new Map(anime.dubs);

    dubsStubs.map(dub => {
      dub.episodes = new Map(dub.episodes);

      dubsMap.set(dub.id, Object.assign({}, getDubTemplate(), dub));
    });

    anime.dubs = dubsMap;

    return anime;
  }

  /**
   * Update subs
   *
   * @param {string} id
   * @param {Sub[]} subsStubs
   * @returns {Anime}
   */
  updateSubs ({ id, subsStubs }) {
    debug && console.log('LM:updateSubs', id, subsStubs);

    const anime = this.getAnime(id);
    const subsMap = new Map(anime.subs);

    subsStubs.map(sub => {
      sub.episodes = new Map(sub.episodes);

      subsMap.set(sub.id, Object.assign({}, getSubTemplate(), sub));
    });

    anime.subs = subsMap;

    return anime;
  }

  /**
   * Returns anime
   *
   * @param {string} id
   * @returns {Anime}
   */
  getAnime (id) {
    return this.library.get(id);
  }
}

export function getLibraryManager () {
  return lm;
}
