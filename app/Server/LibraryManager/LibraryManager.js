const EventEmitter = require('events').EventEmitter;

class LibraryManager {
  constructor(rootApp, server) {
    this.server = server;
    this.emitter = new EventEmitter();

    this.entries = new Map();
    this.rootDirectories = [];
  }

  onChunk(cb) {
    this.emitter.on('chunk', cb);
  }

  fireChunk(id, chunk) {
    this.emitter.emit('chunk', {
      id,
      chunk
    });
  }
}

module.exports = LibraryManager;
