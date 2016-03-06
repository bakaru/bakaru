'use strict';

const Promise = require('bluebird');
const path = require('path');
const mkdirpAsync = Promise.promisify(require('mkdirp'));

class PathDispatcher {

  /**
   * @param {App} app
   */
  constructor(app) {
    this.appDataPath = path.join(app.app.getPath('appData'), 'Bakaru');
    this.temp = path.join(this.appDataPath, 'temp');

    this.thirdParty = path.join(
      app.rootDir,
      app.runningDevMode
        ? '..'
        : '../..',
      'vendor'
    );

    this.wcjs = path.join(this.thirdParty, 'wcjs');

    this._createPaths();
  }

  _createPaths() {
    mkdirpAsync(this.appDataPath);
    mkdirpAsync(this.temp);
  }
}

module.exports = PathDispatcher;
