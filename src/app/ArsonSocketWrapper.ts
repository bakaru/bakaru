import * as arson from 'arson';

export default class ArsonSocketWrapper {
  constructor(protected socket: SocketIO.Socket) {}

  on<T>(event: string, callback: (payload: T) => void): void {
    this.socket.on(event, function(payload: string) {
      callback(arson.decode<T>(payload));
    });
  }

  emit<T>(event: string, payload: T): void {
    this.socket.emit(event, arson.encode(payload));
  }

  broadcast<T>(event: string, payload: T): void {
    this.socket.broadcast.emit(event, arson.encode(payload));
  }
}
