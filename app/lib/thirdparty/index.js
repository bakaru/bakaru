'use strict';

const path = require('../path');
const mediaInfo = require('./MediaInfo');
const getMediaInfo = mediaInfo.getInfo;
const setThirdPartyDir = mediaInfo.setThirdPartyDir;

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

module.exports = new Thirdparty();
