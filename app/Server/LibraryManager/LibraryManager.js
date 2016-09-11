const EventEmitter = require('events').EventEmitter;

function makeEntry(id, path) {
  return {
    id,
    path,
    title: '',
    media: {
      width: 0,
      height: 0,
      bitDepth: 8
    },
    episodes: new Map(),
    subtitles: new Map(),
    voiceOvers: new Map()
  };
}

function makeEpisode(id, path) {
  return {
    id,
    path,
    title: '',

  };
}

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
