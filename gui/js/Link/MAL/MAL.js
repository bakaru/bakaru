import 'whatwg-fetch';
import Provider from '../Provider';

class MAL extends Provider {

  searchUrl = 'http://myanimelist.net/api/anime/search.xml?q=';

  /**
   * Search on MAL by title
   *
   * @param title
   * @return {{id: string, title: string, poster: string}[]}
   */
  search(title) {
    super.search(title);

    return fetch(this.searchUrl + encodeURIComponent(title), {
      headers: {
        Authorization: `Basic ${btoa('lolno:123456')}`
      }
    }).then(response => response.text()).then(body => {
      const dom = parseXML(body);
      const link = this.getLinkTemplate();

      link.id = parseInt(dom.querySelector('entry>id').innerHTML);
      link.score = dom.querySelector('entry>score').innerHTML;
      link.poster = dom.querySelector('entry>image').innerHTML;
      link.episodesTotal = parseInt(dom.querySelector('entry>episodes').innerHTML);
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

export default new MAL();

/**
 * @param {string} xml
 * @return {Document}
 */
function parseXML (xml) {
  "use strict";

  const parser = new DOMParser();

  return parser.parseFromString(xml, 'text/xml');
}
