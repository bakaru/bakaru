const bluebird = require('bluebird');
const path = require('path');
const fs = bluebird.promisifyAll(require('fs'));

class FolderReader {

  /**
   * Ctor
   * @param {ServerContext} context
   */
  constructor(context) {
    this.name = 'FolderReader';

    const events = context.events;

    events.on('libraryFolderOpen', this.onLibraryFolderOpen.bind(this));
  }

  onLibraryFolderOpen(path) {

  }
}

module.exports = FolderReader;
