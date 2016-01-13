import Promise from 'bluebird';
import { sep } from 'path';
import { app } from 'electron';
import mkdirp from 'mkdirp';

const mkdirpAsync = Promise.promisify(mkdirp);

const appDataPath = app.getPath('appData') + sep + 'BakaruData';

class Path {
  constructor() {
    this.cache = {
      root: appDataPath + sep + 'Cache',
      animeFolders: appDataPath + sep + 'Cache' + sep + 'AnimeFolders'
    };
    this.temp = appDataPath + sep + 'Temp';
    this.thirdParty = appDataPath + sep + 'Thirdparty';

    console.log(this);

    this.createPaths();
  }

  createPaths() {
    mkdirpAsync(appDataPath);
    mkdirpAsync(this.thirdParty);
    mkdirpAsync(this.temp);
    mkdirpAsync(this.cache.root);
    mkdirpAsync(this.cache.animeFolders);
  }
}

const path = new Path();

export default path;