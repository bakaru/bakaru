import * as actions from 'actions';
import { ipcRenderer } from 'electron';
import { renderer } from 'ipc-events';

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
    state: {
      scanning: true,
      subScanning: true,
      mediainfoScanning: true
    }
  };
}

/**
 * @typedef {{id: string, title: string, path: string, files: Array}} Dub
 */
function getDubTemplate () {
  return {
    id: '',
    title: '',
    path: '',
    files: [],
    embedded: false,
    embeddedStreamIndex: -1
  };
}

/**
 * @typedef {{id: string, title: string, path: string, files: Array}} Sub
 */
function getSubTemplate () {
  return {
    id: '',
    title: '',
    path: '',
    files: [],
    embedded: false,
    embeddedStreamIndex: -1
  };
}

/**
 * @typedef {{id: string, ext: string, name: string, path: string, filename: string, duration: string, scanning: boolean}} Episode
 */
function getEpisodeTemplate () {
  return {
    id: '',
    ext: '',
    name: '',
    path: '',
    filename: '',
    duration: '',
    scanning: false
  };
}

export default class LibraryManager {
  constructor (store) {
    this.store = store;

    /**
     * @type {Map.<string, Anime>}
     */
    this.library = new Map();

    this._setupIpcHandlers();
  }

  _setupIpcHandlers () {
    ipcRenderer.on(renderer.addAnimeFolder, (event, data) => {
      this.store.dispatch(actions.updateAnimeFolder(this.create(data)));
    });

    ipcRenderer.on(renderer.updateEpisodes, (event, data) => {
      this.store.dispatch(actions.updateAnimeFolder(this.addEpisodes(data)));
    });

    ipcRenderer.on(renderer.updateEpisode, (event, data) => {
      this.store.dispatch(actions.updateAnimeFolder(this.updateEpisode(data)));
    });

    ipcRenderer.on(renderer.updateDubs, (event, data) => {
      this.store.dispatch(actions.updateAnimeFolder(this.updateDubs(data)));
    });

    ipcRenderer.on(renderer.updateSubs, (event, data) => {
      this.store.dispatch(actions.updateAnimeFolder(this.updateSubs(data)));
    });

    ipcRenderer.on(renderer.flagAddAnimeFolderStart, () => {
      this.store.dispatch(actions.flagAddFolderStart());
    });

    ipcRenderer.on(renderer.flagAddAnimeFolderEnd, () => {
      this.store.dispatch(actions.flagAddFolderEnd());
    });
  }

  /**
   * Create new anime entry
   *
   * @param {{id: string, title: string, path: string}} animeStub
   * @returns {Anime}
   */
  create (animeStub) {
    let anime = this.getAnime(animeStub.id);

    if (anime !== null) {
      anime.state.scanning = true;

      return anime;
    }

    anime = Object.assign({}, getAnimeTemplate(), animeStub);

    this.library.set(id, anime);

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

    const { width, height, bitDepth, format } = mediaInfo;

    anime.width = width;
    anime.height = height;
    anime.bitDepth = bitDepth;
    anime.format = format;

    return anime;
  }

  /**
   * Add episodes
   *
   * @param {string} id
   * @param {{id: string, title: string, path: string, filename: string}[]} episodesStubs
   * @returns {Anime}
   */
  addEpisodes ({ id, episodesStubs }) {
    const anime = this.getAnime(id);
    const episodesMap = new Map(anime.episodes);

    episodesStubs.map(episodeStub => {
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
    const anime = this.getAnime(id);
    const episodesMap = new Map(anime.episodes);

    episodesMap.set(episodeStub.id, episodeStub);

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
    const anime = this.getAnime(id);
    const dubsMap = new Map(anime.dubs);

    dubsStubs.map(dub => {
      dubsMap.set(dub.id, dub);
    });

    anime.dubs = dubsMap;

    return anime;
  }

  /**
   * Update subs
   *
   * @param {string} id
   * @param {Dub[]} subs
   * @returns {Anime}
   */
  updateSubs ({ id, subs }) {
    const subsMap = new Map();

    subs.map(dub => {
      subsMap.set(dub.id, dub);
    });

    const anime = this.getAnime(id);

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