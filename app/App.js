'use strict';

const path = require('./lib/path');
const cache = require('./lib/cache');
const setupIpcMain = require('./ipcMain');

const thirdparty = require('./lib/thirdparty');

class App {
  constructor(electron) {
    this.name = 'Bakaru';

    this.electron = electron;
    this.rootDir = process.cwd();
    this.dialog = electron.dialog;
    this.app = electron.app;
    this.ipc = electron.ipcMain;
    this.runningDevMode = false;

    this.mainWindowUrl = `file://${__dirname}/gui/index.html`;
    this.mainWindow = null;

    setupIpcMain(this);
    this._setupAppEventListeners();
  }


  /**
   * Creates main window
   */
  createMainWindow() {
    this.mainWindow = new this.electron.BrowserWindow({
      width: 850,
      height: 720,
      title: 'Bakaru',
      frame: false,
      icon: this.rootDir + '/icon.png'
    });

    // and load the index.html of the app.
    console.log(this.mainWindowUrl);
    this.mainWindow.loadURL(this.mainWindowUrl);

    this.mainWindow.webContents.on('dom-ready', () => {
      cache.restore(this.mainWindow.webContents);
    });

    if (this.runningDevMode) {
      this.mainWindow.webContents.openDevTools({
        detach: true
      });
    }

    // this.mainWindow.setProgressBar(.5);

    // Emitted when the window is closed.
    this.mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this.mainWindow = null;
    });
  }

  /**
   * Setup app events listeners
   *
   * @private
   */
  _setupAppEventListeners() {
    this.app.on('ready', this.createMainWindow.bind(this));

    this.app.on('window-all-closed', () => {
      cache.flush().then(() => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
          this.app.quit();
        }
      });
    });

    this.app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (this.mainWindow === null) {
        this.createMainWindow();
      }
    });
  }
}

module.exports = App;
