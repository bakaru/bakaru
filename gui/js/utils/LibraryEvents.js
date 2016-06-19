const EventEmitter = require('events').EventEmitter;

class LibraryEvents {
  constructor(emitter) {
    this.e = emitter;
  }

  watched(entryId, episodeId) {
    this.e.emit('watched', {entryId, episodeId});
  }

  onWatched(cb) {
    this.e.on('watched', cb);
  }
}

export default new LibraryEvents(new EventEmitter());
