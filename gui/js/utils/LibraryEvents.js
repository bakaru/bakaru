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

  onSelectSub(cb) {
    this.e.on('select_sub', cb);
  }

  selectSub(entryId, subId) {
    this.e.emit('select_sub', { entryId, subId });
  }

  onSelectDub(cb) {
    this.e.on('select_dub', cb);
  }

  selectDub(entryId, dubId) {
    this.e.emit('select_dub', { entryId, dubId });
  }
}

export default new LibraryEvents(new EventEmitter());
