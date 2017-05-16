import './bootstrap/lookupHostAddress'
import * as fs from 'fs'
import * as path from 'path'
import * as debug from 'debug'
import * as express from 'express'
import * as WebSocket from 'ws'
import { createServer } from 'http'
import EventEmitter from './events'
import PluginManager from './PluginManager'
import SockRelay from './SockRelay'
import Window from './Window'

// Core modules
import FolderExplorer from './FolderExplorer'
import LibraryManager from './LibraryManager'
import SystemFolderOpener from './SystemFolderOpener'
import MediaPropsExplorer from './MediaPropsExplorer'
import CommonGUIRelay from './CommonGUIRelay'

const log = debug('bakaru:server');

export interface ServerContext {
  library: Map<string, Bakaru.Entry>
  socket?: SockRelay
  events?: EventEmitter
  http?: express.Router
  window?: Window
}

export default function bootServer(port: number = 44888): void {
  // Set urls
  global.bakaru.paths['mainWindowUrl'] = `http://127.0.0.1:${port}/main`;
  global.bakaru.paths['remoteWindowUrls'] = global.bakaru.addresses.map(address => {
    return `http://${address}:${port}/remote`;
  });

  const app = express();
  const http = createServer(app);
  const events = new EventEmitter();
  const socket = new SockRelay(
    new WebSocket.Server({ server: http }),
    events
  );

  app.use('/gui', express.static(path.join(__dirname, '../gui')));
  app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, '../gui/index.html'));
  });
  app.use('/remote', express.static(path.join(__dirname, '../remote')));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../remote/index.html'));
  });

  http.listen(port);
  log(`Server up and running at http://127.0.0.1:${port}`);

  const serverContext: ServerContext = {
    http: app,
    socket,
    events,
    window: new Window(),
    library: new Map()
  };

  global.bakaru.pm = new PluginManager(serverContext, [
    FolderExplorer,
    LibraryManager,
    SystemFolderOpener,
    MediaPropsExplorer,
    CommonGUIRelay
  ]);
}
