const EventEmitter = require('events').EventEmitter;

class LibraryEvents {
  constructor(emitter) {
    this.e = emitter;
  }

  stopped(entryId, episodeId, time) {
    setImmediate(_ => this.e.emit('stopped_at', {entryId, episodeId, time}));
  }

  onStopped(cb) {
    this.e.on('stopped_at', cb);
  }

  resurrect(entries) {
    this.e.emit('resurrect', entries);
  }

  onResurrect(cb) {
    this.e.on('resurrect', cb);
  }

  updateMalLink(entryId, link) {
    setImmediate(_ => this.e.emit('update_link', {entryId, link:{mal: link}}));
  }

  onUpdateMalLink(cb) {
    this.e.on('update_link', cb);
  }

  removeEntry(entryId) {
    setImmediate(_ => this.e.emit('remove_entry', {entryId}));
  }

  onRemoveEntry(cb) {
    this.e.on('remove_entry', cb);
  }
}

export default new LibraryEvents(new EventEmitter());
