const createServer = require('http').createServer;
const createExpress = require('express');
const createSockets = require('socket.io');

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
    const app = createExpress();
    const events = new CustomEventEmitter();
    const httpServer = createServer(app);
    const socketServer = createSockets(httpServer);

    this.port = 59180;
    this.events = events;
    this.sockets = socketServer;

    this.plugins = new Plugins({
      rootApp,
      events,
      app
    });

    this.onClientEvent = this.onClientEvent.bind(this);

    events.setEmitInterceptor(this.onServerEvent.bind(this));
    socketServer.on('connection', this.onConnection.bind(this));

    httpServer.listen(this.port);
  }

  onServerEvent(event, data) {
    this.sockets.emit('_client_event', { event, data });
  }

  onClientEvent({ event, data }) {
    this.events.emit(event, data);
  }

  onConnection(socket) {
    socket.on('_client_event', this.onClientEvent);
  }
}

module.exports = Server;
