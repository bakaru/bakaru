'use strict';

import LibraryEvents from 'utils/LibraryEvents';

export default class MAL {

  searchUrl = 'http://myanimelist.net/api/anime/search.xml?q=';

  listUrl = 'http://myanimelist.net/malappinfo.php?type=anime&u=';

  constructor () {
    this.store = null;
  }

  setStore (store) {
    this.store = store;
  }

  _getCredentials () {
    const state = this.store.getState();

    const login = state.settings.mal_login;
    const pass = state.settings.mal_pass;

    return btoa(`${login}:${pass}`);
  }

  /**
   * Search on MAL by title
   *
   * @param title
   * @return {{id: string, title: string, poster: string}[]}
   */
  search(entryId, title) {
    return fetch(this.searchUrl + encodeURIComponent(title), {
      headers: {
        Authorization: `Basic ${this._getCredentials()}`
      }
    }).then(response => response.text()).then(body => {
      const dom = parseXML(body);
      const link = {
        id: '',
        score: '',
        poster: '',
        episodesTotal: 0
      };

      link.id = parseInt(dom.querySelector('entry>id').innerHTML);
      link.score = parseFloat(dom.querySelector('entry>score').innerHTML);
      link.poster = dom.querySelector('entry>image').innerHTML;
      link.episodesTotal = parseInt(dom.querySelector('entry>episodes').innerHTML);

      LibraryEvents.updateMalLink(entryId, link);
    });
  }

  /**
   * Returns MAL entry by id
   *
   * @param id
   * @return {{id: string, title: string, poster: string, episodesTotal: string, episodesSeen: string}}
   */
  get(id) {
    return super.get(id)
  }

  /**
   * Set new episodes seen count
   *
   * @param id
   * @param episodesSeen
   * @return {*}
   */
  setEpisodesSeen(id, episodesSeen) {
    return super.setEpisodesSeen(id, episodesSeen)
  }
}

/**
 * @param {string} xml
 * @return {Document}
 */
function parseXML (xml) {
  "use strict";

  const parser = new DOMParser();

  return parser.parseFromString(xml, 'text/xml');
}
