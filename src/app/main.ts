// We need this for Electron to accept this as correct application
require('electron');

import Window from './Window';
import Server from './Server';

global.window = new Window();
global.server = new Server();

process.on('uncaughtException', e => {
  console.error(e);
  
  process.exit(1);
});
