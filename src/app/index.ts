// We need this for Electron to accept this as correct application
import { app, BrowserWindow } from 'electron';

const windows = new WeakSet<Electron.BrowserWindow>();

const t = {
  t1: 123,
  t2: 321
};

app.on('ready', () => {
  console.log('ready', Object.assign({}, t, { t2: 34 }));

  windows.add(new BrowserWindow());
});

// import Window from './Window';
// import Server from './Server';
//
// process.argv;
//
// global.window = new Window();
// global.server = new Server();
//
// process.on('uncaughtException', e => {
//   console.error(e);
//
//   process.exit(1);
// });
