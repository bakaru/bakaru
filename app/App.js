import Promise from 'bluebird';
import mkdirp from 'mkdirp';
import { sep } from 'path';
import setupIpcMain from './ipcMain';

import { setThirdPartyDir } from 'lib/thirdparty/MediaInfo';

const mkdirpAsync = Promise.promisify(mkdirp);

export default class App {
  constructor(electron) {
    this.name = 'Bakaru';

    this.electron = electron;
    this.rootDir = process.cwd();
    this.dialog = electron.dialog;
    this.app = electron.app;
    this.ipc = electron.ipcMain;

    this.mainWindow = null;

    this._setupVariables();
    this._createDirsIfNotExist();
    setupIpcMain(this);
    this._setupAppEventListeners();
  }

  _setupVariables() {
    this.appDir = this.app.getPath('appData') + sep + this.name + 'Data';
    this.thirdPartyDir = this.appDir + sep + 'Thirdparty';
    this.tempDir = this.appDir + sep + 'Temp';

    setThirdPartyDir(this.thirdPartyDir);
  }

  /**
   * Creates app directories
   */
  _createDirsIfNotExist() {
    mkdirpAsync(this.appDir);
    mkdirpAsync(this.thirdPartyDir);
    mkdirpAsync(this.tempDir);
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
    this.mainWindow.loadURL('file:///app/gui/index.html');

    // Open the DevTools.
    this.mainWindow.webContents.openDevTools();

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
    this.app.on('ready', ::this.createMainWindow);

    this.app.on('window-all-closed', () => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        this.app.quit();
      }
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
