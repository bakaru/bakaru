import * as arson from 'arson'
import * as debug from 'debug'
import * as WebSocket from 'ws'
import EventEmitter, { Event } from "./Events"

const log = debug('bakaru:server:sock-relay');

export default class SockRelay {
  protected sockets: Set<WebSocket> = new Set();

  constructor(protected server: WebSocket.Server, protected ee: EventEmitter) {
    server.on('connection', this.onConnect.bind(this));
  }

  private onConnect(socket: WebSocket) {
    this.sockets.add(socket);

    socket.on('close', () => this.sockets.delete(socket));
    socket.on('message', (data, flags) => this.onMessage(socket, data, flags));
  }

  private onMessage(socket: WebSocket, packet: string, flags: { binary: boolean }) {
    const [eventName, payload] = arson.decode<[Event, any]>(packet);

    this.ee.emit(eventName, payload);

    for (const connectedSocket of this.sockets) {
      if (connectedSocket !== socket) {
        connectedSocket.send(packet);
      }
    }
  }

  on(eventName: Event, cb: (payload: any) => void) {
    this.ee.on(eventName, cb);
  }

  emit(eventName: Event, payload: any) {
    const packet = arson.encode([eventName, payload]);

    for (const socket of this.sockets) {
      socket.send(packet);
    }
  }
}
