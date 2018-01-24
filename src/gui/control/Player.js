import { EventEmitter } from 'events'
import Backend from 'shared/Backend'
import Event from 'shared/Event'

class Player {
  constructor() {
    this.ee = new EventEmitter();

    Backend.on(Event.PlayerPlay, () => this.ee.emit(Event.PlayerPlay));
    Backend.on(Event.PlayerPause, () => this.ee.emit(Event.PlayerPause));
    Backend.on(Event.PlayerSetMedia, media => this.ee.emit(Event.PlayerSetMedia, media));
    Backend.on(Event.PlayerVolume, volume => this.ee.emit(Event.PlayerVolume, volume));
    Backend.on(Event.PlayerMute, mute => this.ee.emit(Event.PlayerMute, mute));
    Backend.on(Event.PlayerSeek, time => this.ee.emit(Event.PlayerSeek, time));
  }

  emitBoth(event, payload) {
    this.ee.emit(event, payload);
    Backend.emit(event, payload);
  }

  play() {
    this.emitBoth(Event.PlayerPlay);
  }

  pause() {
    this.emitBoth(Event.PlayerPause);
  }

  media(entryId, episodeId) {
    this.emitBoth(Event.PlayerSetMedia, { entryId, episodeId });
  }

  volume(volume) {
    this.emitBoth(Event.PlayerVolume, volume);
  }

  mute(mute) {
    this.emitBoth(Event.PlayerMute, mute);
  }

  seek(time) {
    this.emitBoth(Event.PlayerSeek, time);
  }

  onPlay(cb) {
    this.ee.on(Event.PlayerPlay, cb);
  }

  onPause(cb) {
    this.ee.on(Event.PlayerPause, cb);
  }

  onMedia(cb) {
    this.ee.on(Event.PlayerSetMedia, cb);
  }

  onVolume(cb) {
    this.ee.on(Event.PlayerVolume, cb);
  }

  onMute(cb) {
    this.ee.on(Event.PlayerMute, cb);
  }

  onSeek(cb) {
    this.ee.on(Event.PlayerSeek, cb);
  }
}

export default new Player();
