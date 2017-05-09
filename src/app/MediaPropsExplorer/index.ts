import { ServerContext } from '../server'
import { Event } from '../Events'
import { Plugin } from '../PluginManager'
import VideoInfo, { Priority } from './VideoInfo'

export default class MediaPropsExplorer implements Plugin {
  private videoInfo: VideoInfo;

  getId(): string {
    return 'media-props-explorer';
  }

  constructor(protected context: ServerContext) {
    this.videoInfo = new VideoInfo();

    this.context.events.on(
      Event.MediaPropsRequest,
      this.onRequest.bind(this)
    );
  }

  private async onRequest(
    request: Bakaru.MediaPropsExplorerRequest,
    priority: number = Priority.LowPriority
  ): Promise<void> {
    this.emitResponse(
      request,
      await this.videoInfo.get(request.path, priority)
    );
  }

  private emitResponse(request: Bakaru.MediaPropsExplorerRequest, media: Bakaru.ParsedMedia): void {
    const response: Bakaru.MediaPropsExplorerResponse = {
      entryId: request.entryId,
      mediaId: request.mediaId,
      media
    };

    this.context.events.emit(
      Event.MediaPropsResponse,
      response
    );
  }
}
