import path from 'lib/path';
import getMediaInfo, { setThirdPartyDir } from './MediaInfo';

class Thirdparty {
  constructor() {
    this._initMediaInfo();
  }

  _initMediaInfo() {
    setThirdPartyDir(path.thirdParty);
  }

  /**
   * Returns file media info
   *
   * @param {string} filepath
   * @returns {Promise.<TResult>|Promise.<T>}
   */
  getMediaInfo(filepath) {
    return getMediaInfo(filepath);
  }
}

export default new Thirdparty();