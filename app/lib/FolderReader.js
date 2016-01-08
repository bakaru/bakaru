import getFolderItemsType from 'lib/FolderTypeDetector';
import Promise from 'bluebird';
import { sep } from 'path';
import { readdir } from 'fs';

const readdirAsync = Promise.promisify(readdir);

export default class FolderReader {
  constructor (sendFolderRead) {
    this.sendFolderRead = sendFolderRead;
  }

  read (path) {
    readdirAsync(path).then(itemsNames => {
      getFolderItemsType(path, itemsNames).then(type => {
        this.sendFolderRead({
          path,
          type
        });
      });
    });
  }
}
