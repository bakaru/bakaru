const EventEmitter = require('events').EventEmitter;

/**
 * @typedef {{entryId: string, subId: string, dubId: string}} PlaylistItem
 */


class PlayerControls {
  constructor(emitter) {
    this.e = emitter;
  }

  /**
   * @param {PlaylistItem[]} playlist
   */
  playlist(playlist, playImmediate = false) {
    this.e.emit('playlist', playlist, playImmediate);
  }

  play(postponed = false) {
    this.e.emit('play', postponed);
  }

  pause() {
    this.e.emit('pause');
  }

  onPlay(cb) {
    this.e.on('play', cb);
  }

  onPause(cb) {
    this.e.on('pause', cb);
  }

  onPlaylist(cb) {
    this.e.on('playlist', cb);
  }
}

export default new PlayerControls(new EventEmitter());
