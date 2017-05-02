import { EventEmitter } from 'events'
import * as arson from 'arson'

const conn = window.wtf = new WebSocket(`ws://${window.location.host}`);

class Backend {
  constructor() {
    this.ee = new EventEmitter();

    conn.onmessage = this._handleMessage.bind(this);
  }

  _handleMessage(packet) {
    const [eventName, payload] = arson.parse(packet);

    this.ee.emit(eventName, payload);
  }

  on(eventName, cb) {
    this.ee.on(eventName, cb);
  }

  emit(eventName, payload) {
    const packet = arson.encode([eventName, payload]);

    conn.send(packet);
  }
}

export default new Backend();

export const connection = new Promise((resolve, reject) => {
  conn.onopen = resolve;
  conn.onerror = reject;
});
