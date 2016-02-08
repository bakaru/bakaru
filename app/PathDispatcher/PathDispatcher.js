'use strict';

const Promise = require('bluebird');
const path = require('path');
const mkdirpAsync = Promise.promisify(require('mkdirp'));

class PathDispatcher {

  /**
   * @param {App} app
   */
  constructor(app) {
    const appPath = app.app.getAppPath();

    this.appDataPath = path.join(app.app.getPath('appData'), 'BakaruData');
    this.cache = {
      root: path.join(this.appDataPath, 'cache'),
      animeFolders: path.join(this.appDataPath, 'cache', 'AnimeFolders'),
    };
    this.temp = path.join(this.appDataPath, 'temp');
    this.thirdParty = path.join(app.rootDir, '..', 'thirdparty');

    this._createPaths();
  }

  _createPaths() {
    mkdirpAsync(this.appDataPath);
    mkdirpAsync(this.temp);
    mkdirpAsync(this.cache.root);
    mkdirpAsync(this.cache.animeFolders);
  }
}

module.exports = PathDispatcher;