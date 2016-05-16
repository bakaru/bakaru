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
 * @typedef {{id: string, ext: string, name: string, path: string, filename: string, duration: string|boolean}} Episode
 */
function getEpisodeTemplate () {
  return {
    id: '',
    ext: '',
    name: '',
    path: '',
    filename: '',
    duration: false
  };
}

export default class LibraryManager {
  constructor (store) {
    this.store = store;

    console.log(this.store);

    /**
     * @type {Map.<string, Anime>}
     */
    this.library = new Map();

    this._setupIpcHandlers();
  }

  openSelectFolderDialog () {
    return () => {
      ipcRenderer.send('main:openSelectFolderDialog');
    };
  }

  _setupIpcHandlers () {
    ipcRenderer.on(renderer.addAnimeFolder, (event, data) => {
      this.store.dispatch(actions.updateAnimeFolder(this.create(data)));
    });

    ipcRenderer.on(renderer.addEpisodes, (event, data) => {
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

    ipcRenderer.on(renderer.setMediaInfo, (event, data) => {
      this.store.dispatch(actions.updateAnimeFolder(this.setMediaInfo(data)));
    });

    //ipcRenderer.on(renderer.startSubsScanning, (event, id) => {
    //  this.store.dispatch(actions.updateAnimeFolder(this.startSubsScanning(id)));
    //});

    ipcRenderer.on(renderer.stopSubsScanning, (event, id) => {
      this.store.dispatch(actions.updateAnimeFolder(this.stopSubsScanning(id)));
    });

    ipcRenderer.on(renderer.startMediaInfoScanning, (event, id) => {
      this.store.dispatch(actions.updateAnimeFolder(this.startMediaInfoScanning(id)));
    });

    ipcRenderer.on(renderer.stopMediaInfoScanning, (event, id) => {
      this.store.dispatch(actions.updateAnimeFolder(this.stopMediaInfoScanning(id)));
    });

    ipcRenderer.on(renderer.stopScanning, (event, id) => {
      this.store.dispatch(actions.updateAnimeFolder(this.stopScanning(id)));
    });

    ipcRenderer.on(renderer.flagAddAnimeFolderStart, () => {
      this.store.dispatch(actions.flagAddFolderStart());
    });

    ipcRenderer.on(renderer.flagAddAnimeFolderEnd, () => {
      this.store.dispatch(actions.flagAddFolderEnd());
    });
  }

  stopScanning (id) {
    console.log('LM:stopScanning', id);

    const anime = this.getAnime(id);

    anime.state.scanning = false;

    return anime;
  }

  startSubsScanning (id) {
    console.log('LM:startSubsScanning', id);

    const anime = this.getAnime(id);

    anime.state.subScanning = true;

    return anime;
  }

  stopSubsScanning (id) {
    console.log('LM:stopSubsScanning', id);

    const anime = this.getAnime(id);

    anime.state.subScanning = false;

    return anime;
  }

  startMediaInfoScanning (id) {
    console.log('LM:startMediaInfoScanning', id);

    const anime = this.getAnime(id);

    anime.state.mediainfoScanning = true;

    return anime;
  }

  stopMediaInfoScanning (id) {
    console.log('LM:stopMediaInfoScanning', id);

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
    console.log('LM:create', animeStub);

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
    console.log('LM:setMediaInfo', anime, id, mediaInfo);

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
    console.log('LM:addEpisodes', id, episodesStubs);

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
    console.log('LM:updateEpisode', id, episodeStub);

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
    console.log('LM:updateDubs', id, dubsStubs);

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
    console.log('LM:updateSubs', id, subsStubs);

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