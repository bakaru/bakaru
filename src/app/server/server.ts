import * as path from 'path';
import * as debug from 'debug';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { createServer } from 'http';
import './lookupHostAddress';
import PluginManager from './PluginManager';

const log = debug('bakaru:server');

export interface ServerContext {
  library: any
  videoInfo: any
}

export default function bootServer(port: number = 44888): void {
  // Set urls
  global.bakaru.paths['mainWindowUrl'] = `http://127.0.0.1:${port}/main`;
  global.bakaru.paths['remoteWindowUrls'] = global.bakaru.addresses.map(address => {
    return `http://${address}:${port}/main`;
  });

  const app = express();
  const http = createServer(app);
  const io = socketIo(http);

  app.use(express.static(path.join(__dirname, '../../gui')));
  app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, '../../gui/index.html'));
  });

  const serverContext: ServerContext = {
    library: {},
    videoInfo: {}
  };

  const pm = new PluginManager(serverContext);

  http.listen(port);
  log(`Server up and running at http://127.0.0.1:${port}`);
}
