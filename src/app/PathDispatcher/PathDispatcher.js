'use strict';

const Promise = require('bluebird');
const path = require('path');
const mkdirpAsync = Promise.promisify(require('mkdirp'));

class PathDispatcher {

  /**
   * @param {App} rootApp
   */
  constructor(rootApp) {
    this.appDataPath = path.join(rootApp.app.getPath('userData'));
    this.preferences = path.join(this.appDataPath, 'BakaruPreferences');
    this.cache= path.join(this.appDataPath, 'BakaruCache');
    this.temp = path.join(this.appDataPath, 'BakaruTemp');

    this.thirdParty = path.join(
      rootApp.rootDir,
      rootApp.runningDevMode
        ? '..'
        : '../..',
      'vendor'
    );

    this.wcjs = path.join(this.thirdParty, 'wcjs');

    this._createPaths();
  }

  _createPaths() {
    mkdirpAsync(this.appDataPath).catch(e => console.error('appDataPath', this.appDataPath, e));
    mkdirpAsync(this.preferences).catch(e => console.error('preferences', this.preferences, e));
    mkdirpAsync(this.cache).catch(e => console.error('cache', this.cache, e));
    mkdirpAsync(this.temp).catch(e => console.error('temp', this.temp, e));
  }
}

module.exports = PathDispatcher;
