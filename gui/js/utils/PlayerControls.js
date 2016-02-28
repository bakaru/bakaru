const EventEmitter = require('events').EventEmitter;

class PlayerControls {
  constructor(emitter) {
    this.e = emitter;
  }

  play() {
    this.e.emit('play');
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
}

export default new PlayerControls(new EventEmitter());