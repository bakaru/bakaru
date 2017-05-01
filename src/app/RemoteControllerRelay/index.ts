import { ServerContext } from '../server';
import { Plugin } from '../PluginManager';
import * as debug from 'debug';

const log = debug('bakaru:server:RCR');

const events = {
  state: 'ui::syncedstate'
};

export default class RemoteControllerRelay implements Plugin {
  getId(): string {
    return 'media-props-explorer';
  }

  constructor(protected context: ServerContext) {
    //console.log(context.socket);

    context.socket.on(events.state, state => {
      if (state == 2) {
        process.exit(1);
      }

      log('Yay! State', state);

      //context.socket.broadcast(events.state, state);
    });
  }
}
