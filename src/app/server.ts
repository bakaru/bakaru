import * as path from 'path';
import * as debug from 'debug';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { createServer } from 'http';
import './bootstrap/lookupHostAddress';
import PluginManager from './PluginManager';
import Window from './Window';
import Events from './Events';

// Core modules
import FolderExplorer from './FolderExplorer';
import LibraryManager from './LibraryManager';
import SystemFolderOpener from './SystemFolderOpener';
import MediaPropsExplorer from './MediaPropsExplorer';
import RemoteControllerRelay from './RemoteControllerRelay';

const log = debug('bakaru:server');

export interface ServerContext {
  library: Map<string, Entry>
  socket?: SocketIO.Namespace
  events?: Events
  http?: express.Router
  window?: Window
}

export default function bootServer(port: number = 44888): void {
  // Set urls
  global.bakaru.paths['mainWindowUrl'] = `http://127.0.0.1:${port}/main`;
  global.bakaru.paths['remoteWindowUrls'] = global.bakaru.addresses.map(address => {
    return `http://${address}:${port}/main`;
  });

  const app = express();
  const http = createServer(app);
  const io: SocketIO.Server = socketIo(http);

  app.use(express.static(path.join(__dirname, '../gui')));
  app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, '../gui/index.html'));
  });

  http.listen(port);
  log(`Server up and running at http://127.0.0.1:${port}`);

  const serverContext: ServerContext = {
    http: app,
    socket: io.sockets,
    events: new Events(),
    window: new Window(),
    library: new Map()
  };

  global.bakaru.pm = new PluginManager(serverContext, [
    FolderExplorer,
    LibraryManager,
    SystemFolderOpener,
    MediaPropsExplorer,
    RemoteControllerRelay
  ]);
}
