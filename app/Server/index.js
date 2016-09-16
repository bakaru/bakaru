const http = require('http').createServer;
const app = require('express')();
const ws = require('socket.io');

const Plugins = require('./Plugins');

class CustomEventEmitter {
  constructor(interceptor = () => {}) {
    this.interceptor = interceptor;
    this.events = new EventEmitter();
  }

  setEmitInterceptor(interceptor) {
    this.interceptor = interceptor;
  }

  on(event, cb) {
    this.events.on(event, cb);
  }

  emit(event, data) {
    this.interceptor(event, data);
    this.events.emit(event, data);
  }
}
class Server {

  /**
   * Ctor
   * @param {App} rootApp
   */
  constructor(rootApp) {
    this.port = 59180;

    this.http = http(app);
    this.app = app;
    this.ws = ws(this.http);

    this.events = new CustomEventEmitter();
    this.plugins = new Plugins(this);

    this.onClientEvent = this.onClientEvent.bind(this);

    this.events.setEmitInterceptor(this.onServerEvent.bind(this));
    this.ws.on('connection', this.onConnection.bind(this));

    this.http.listen(this.port);
  }

  onServerEvent(event, data) {
    this.ws.emit('_client_event', { event, data });
  }

  onClientEvent({ event, data }) {
    this.events.emit(event, data);
  }

  onConnection(socket) {
    socket.on('_client_event', this.onClientEvent);
  }
}

module.exports = Server;
