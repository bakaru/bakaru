export default class Provider {

  /**
   * Search title
   *
   * @param {string} title
   * @returns {{id: string, title: string, poster: string}[]}
   */
  search (title) {}

  /**
   * Returns entry by id
   *
   * @param {string} id
   * @returns {{id: string, title: string, poster: string, episodesTotal: string, episodesSeen: string}}
   */
  get (id) {}

  /**
   * Sets new episodes seen count
   *
   * @param {string} id
   * @param {number} episodesSeen
   */
  setEpisodesSeen (id, episodesSeen) {}

  /**
   * @return {{id: string, score: string, poster: string, episodesTotal: number, episodesSeen: number}}
   */
  getLinkTemplate () {
    return {
      id: '',
      score: '',
      poster: '',
      episodesTotal: 0,
      episodesSeen: 0
    };
  }
}