const Syncer = require('./Syncer');

class LibraryManager {

  /**
   * Ctor
   *
   * @param {ServerContext} context
   */
  constructor(context) {
    this.name = 'LibraryManager';

    this.events = context.events;
    this.syncer = new Syncer(context.paths.root);
  }


}

module.exports = LibraryManager;
