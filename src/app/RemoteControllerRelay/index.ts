import { ServerContext } from '../server';
import { Plugin } from '../PluginManager';
import * as debug from 'debug';

const log = debug('bakaru:server:RCR');

const events = {
  state: 'ui::syncedstate'
};

export default class RemoteControllerRelay implements Plugin {
  getId(): string {
    return 'remote-controller-relay';
  }

  constructor(protected context: ServerContext) {
    context.socket.on('test', pl => {
      log('Yay! State', pl);
    });
  }
}
