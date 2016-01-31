import Promise from 'bluebird';
import { sep, resolve } from 'path';
import { app } from 'electron';
import mkdirp from 'mkdirp';

const mkdirpAsync = Promise.promisify(mkdirp);

const appDataPath = app.getPath('appData') + sep + 'BakaruData';

class Path {
  constructor() {
    this.cache = {
      root: appDataPath + sep + 'cache',
      animeFolders: appDataPath + sep + 'cache' + sep + 'AnimeFolders'
    };
    this.temp = appDataPath + sep + 'temp';

    const appPath = app.getAppPath();

    if (appPath.indexOf('default_app') > -1) {
      this.thirdParty = resolve('./thirdparty');
    } else {
      this.thirdParty = appPath + sep + 'thirdparty';
    }

    this._createPaths();
  }

  _createPaths() {
    mkdirpAsync(appDataPath);
    mkdirpAsync(this.temp);
    mkdirpAsync(this.cache.root);
    mkdirpAsync(this.cache.animeFolders);
  }
}

const path = new Path();

export default path;