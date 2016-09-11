const path = require('path');
const http = require('http').createServer;
const app = require('express')();
const ws = require('socket.io');

const MediaInfo = require('./MediaInfo');
const createFolderReader = require('./FolderReader');
const PathDispatcher = require('./PathDispatcher');

class Server {

  /**
   * Ctor
   * @param {App} rootApp
   */
  constructor(rootApp) {
    this.paths = new PathDispatcher(rootApp);
    this.mediaInfo = new MediaInfo(path.join(this.paths.thirdParty, 'MediaInfo', 'MediaInfo.exe'));
    this.folderReader = createFolderReader(rootApp);

    this.port = 59180;

    this.http = http(app);
    this.app = app;
    this.ws = ws(this.http);

    this.ws.on('connection', this.onConnection.bind(this));

    this.http.listen(this.port);
  }

  onConnection(socket) {
    console.log('Yay connection');
  }
}

module.exports = Server;
