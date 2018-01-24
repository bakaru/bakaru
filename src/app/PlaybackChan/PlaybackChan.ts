import { ServerContext } from '../server'
import { Event } from '../Events'
import { Plugin } from '../PluginManager'

export class PlaybackChan implements Plugin {
  protected currentMedia: {}

  getId(): string {
    return 'playback-chan';
  }

  constructor(protected context: ServerContext) {
    this.context.events.on(
      Event.PlayerSetMedia,
      this.onPlayerSetMedia.bind(this)
    );
  }

  onPlayerSetMedia(media) {
    this.currentMedia = media;
  }
}
