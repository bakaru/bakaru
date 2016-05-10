import * as actions from 'actions';
import { ipcRenderer } from 'electron';
import { renderer } from 'ipc-events';

/**
 * @typedef {{id: string, title: string, path: string, dubs: Map, subs: Map, bonuses: Map, episodes: Map, quality: string, media: {width: number, height: number, bitDepth: number, format: string}, state: {scanning: boolean, subScanning: boolean, mediainfoScanning: boolean}}} Anime
 */
const animeTemplate = {
  id: '',
  title: '',
  path: '',
  dubs: new Map(),
  subs: new Map(),
  bonuses: new Map(),
  episodes: new Map(),
  quality: "unknown",
  media: {
    width: 0,
    height: 0,
    bitDepth: 8,
    format: ''
  },
  state: {
    scanning: true,
    subScanning: true,
    mediainfoScanning: true
  }
};

/**
 * @typedef {{id: string, title: string, path: string, files: Array}} Dub
 */
const dubTemplate = {
  id: '',
  title: '',
  path: '',
  files: []
};

/**
 * @typedef {{id: string, title: string, path: string, files: Array}} Sub
 */
const subTemplate = {
  id: '',
  title: '',
  path: '',
  files: []
};

/**
 * @typedef {{id: string, ext: string, name: string, path: string, filename: string, duration: string}} Episode
 */
const episodeTemplate = {
  id: '',
  ext: '',
  name: '',
  path: '',
  filename: '',
  duration: ''
};

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
      this.store.dispatch(actions.addAnimeFolder(this._create(data)));
    });

    ipcRenderer.on(renderer.updateEpisodes, (event, data) => {
      this.store.dispatch(actions.updateAnimeFolder(this._updateEpisodes(data)));
    });

    ipcRenderer.on(renderer.updateEpisode, (event, data) => {
      this.store.dispatch(actions.updateAnimeFolder(this._updateEpisode(data)));
    });

    ipcRenderer.on(renderer.updateDubs, (event, data) => {
      this.store.dispatch(actions.updateAnimeFolder(this._updateDubs(data)));
    });

    ipcRenderer.on(renderer.updateSubs, (event, data) => {
      this.store.dispatch(actions.updateAnimeFolder(this._updateSubs(data)));
    });

    ipcRenderer.on(renderer.updateAnimeFolder, (event, animeFolder) => {
      this.store.dispatch(actions.updateAnimeFolder(animeFolder));
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
   * @param {string} id
   * @param {string} title
   * @param {string} path
   * @returns {Anime}
   * @private
   */
  _create ({ id, title, path }) {
    const anime = Object.assign({}, animeTemplate, { id, title, path });

    this.library.set(id, anime);

    return anime;
  }

  /**
   * Update episodes
   *
   * @param {string} id
   * @param {Episode[]} episodes
   * @returns {Anime}
   * @private
   */
  _updateEpisodes ({ id, episodes }) {
    const episodesMap = new Map();

    episodes.map(episode => {
      episodesMap.set(episode.id, episode);
    });

    const anime = this._getAnime(id);

    anime.episodes = episodesMap;

    return anime;
  }

  /**
   * Update episode
   *
   * @param {string} id
   * @param {Episode} episode
   * @returns {Anime}
   * @private
   */
  _updateEpisode ({ id, episode }) {
    const anime = this._getAnime(id);

    anime.episodes.set(episode.id, episode);

    return anime;
  }

  /**
   * Update dubs
   *
   * @param {string} id
   * @param {Dub[]} dubs
   * @returns {Anime}
   * @private
   */
  _updateDubs ({ id, dubs }) {
    const dubsMap = new Map();

    dubs.map(dub => {
      dubsMap.set(dub.id, dub);
    });

    const anime = this._getAnime(id);

    anime.dubs = dubsMap;

    return anime;
  }

  /**
   * Update subs
   *
   * @param {string} id
   * @param {Dub[]} subs
   * @returns {Anime}
   * @private
   */
  _updateSubs ({ id, subs }) {
    const subsMap = new Map();

    subs.map(dub => {
      subsMap.set(dub.id, dub);
    });

    const anime = this._getAnime(id);

    anime.subs = subsMap;

    return anime;
  }

  /**
   * Returns anime
   *
   * @param {string} id
   * @returns {Anime}
   * @private
   */
  _getAnime (id) {
    return this.library.get(id);
  }
}