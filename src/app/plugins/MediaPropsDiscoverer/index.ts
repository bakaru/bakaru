import { ServerContext } from '../../server';
import { Plugin } from '../../PluginManager';
import VideoInfo, { Priority } from './VideoInfo';

export default class MediaPropsDiscoverer implements Plugin {
  private videoInfo: VideoInfo;

  getId(): string {
    return 'media-props-discoverer';
  }

  constructor(protected context: ServerContext) {
    this.videoInfo = new VideoInfo();

    this.context.events.on(
      this.context.events.coreEvents.mediaPropsRequest,
      this.onRequest.bind(this)
    );
  }

  private async onRequest(
    request: MediaPropsDiscoveryRequest,
    priority: number = Priority.LowPriority
  ): Promise<void> {
    this.emitResponse(
      request,
      await this.videoInfo.get(request.path, priority)
    );
  }

  private emitResponse(request: MediaPropsDiscoveryRequest, media: ParsedMedia): void {
    const response: MediaPropsDiscoveryResponse = {
      entryId: request.entryId,
      mediaId: request.mediaId,
      media
    };

    this.context.events.emit(
      this.context.events.coreEvents.mediaPropsResponse,
      response
    );
  }
}
