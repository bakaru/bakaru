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

  play() {
    this.ee.emit(Event.PlayerPlay);
    Backend.emit(Event.PlayerPlay);
  }

  pause() {
    this.ee.emit(Event.PlayerPause);
    Backend.emit(Event.PlayerPause);
  }

  media(entryId, episodeId) {
    this.ee.emit(Event.PlayerSetMedia, { entryId, episodeId });
    Backend.emit(Event.PlayerSetMedia, { entryId, episodeId });
  }

  volume(volume) {
    this.ee.emit(Event.PlayerVolume, volume);
    Backend.emit(Event.PlayerVolume, volume);
  }

  mute(mute) {
    this.ee.emit(Event.PlayerMute, mute);
    Backend.emit(Event.PlayerMute, mute);
  }

  seek(time) {
    this.ee.emit(Event.PlayerSeek, time);
    Backend.emit(Event.PlayerSeek, time);
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
