const EventEmitter = require('events').EventEmitter;

class LibraryEvents {
  constructor(emitter) {
    this.e = emitter;
  }

  stopped(entryId, episodeId, time) {
    setImmediate(_ => this.e.emit('stopped_at', {entryId, episodeId, time}));
  }

  resurrect(entries) {
    this.e.emit('resurrect', entries);
  }

  onStopped(cb) {
    this.e.on('stopped_at', cb);
  }

  onResurrect(cb) {
    this.e.on('resurrect', cb);
  }
}

export default new LibraryEvents(new EventEmitter());
