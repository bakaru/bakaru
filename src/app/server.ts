import * as path from 'path';
import * as debug from 'debug';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { createServer } from 'http';
import './bootstrap/lookupHostAddress';
import PluginManager from './PluginManager';
import Library, { LibraryInterface } from './Library';
import Window from './Window';
import Events from './Events';

// Core plugins
import SystemFolderAdder from './plugins/SystemFolderAdder';
import MediaPropsDiscoverer from './plugins/MediaPropsDiscoverer';

const log = debug('bakaru:server');

export interface ServerContext {
  library: LibraryInterface
  socket?: SocketIO.Server
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
    socket: io,
    events: new Events(),
    window: new Window(),
    library: new Library()
  };

  global.bakaru.pm = new PluginManager(serverContext, [
    SystemFolderAdder,
    MediaPropsDiscoverer
  ]);
}
