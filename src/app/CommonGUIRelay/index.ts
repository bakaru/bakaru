import { ServerContext } from '../server';
import { Event } from '../Events'
import { Plugin } from '../PluginManager';
import * as debug from 'debug';

const log = debug('bakaru:server:common-gui-relay');

export default class CommonGUIRelay implements Plugin {
  getId(): string {
    return 'common-gui-relay';
  }

  constructor(protected context: ServerContext) {
    context.socket.on(Event.LibraryRequest, () => {
      context.socket.emit(Event.LibraryResponse, context.library)
    })

    this.route(Event.LibraryResurrected);

    this.route(Event.EntryExplored);
    this.route(Event.EntryUpdated);
    this.route(Event.EntryDeleted);

    this.route(Event.UpdateCheckPending);
    this.route(Event.UpdateAvailable);
    this.route(Event.UpdateDownloading);
    this.route(Event.UpdateDownloaded);
    this.route(Event.UpdateNotAvailable);
  }

  protected route(event: Event) {
    this.context.events.on(
      event,
      payload => this.context.socket.emit(event, payload)
    );
  }
}
