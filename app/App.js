'use strict';

const events = require('./events');

const createPathDispatcher = require('./PathDispatcher');
const createMediaInfo = require('./MediaInfo');
const createFolderReader = require('./FolderReader');

class App {
  constructor(electron) {
    this.name = 'Bakaru';

    this.electron = electron;
    this.dialog = electron.dialog;
    this.app = electron.app;
    this.ipc = electron.ipcMain;

    this._singleInstance();

    this.events = events;
    this.rootDir = __dirname;

    this.runningDevMode = !!process.env.debug;

    this.mainWindowUrl = `file://${this.rootDir}/../gui/index.html`;
    this.mainWindow = null;

    this.loadModules();
    this._setupAppEventListeners();
  }

  loadModules() {
    this.pathDispatcher = createPathDispatcher(this);
    this.mediaInfo = createMediaInfo(this);
    this.folderReader = createFolderReader(this);
  }

  /**
   * @private
   * @returns {*}
   */
  makeSingleInstance() {
    return this.app.makeSingleInstance(() => {
      if (this.mainWindow !== null) {
        if (this.mainWindow.isMinimized()) {
          this.mainWindow.restore();
        }

        this.mainWindow.focus();
      }
    });
  }

  /**
   * Creates main window
   * @private
   */
  createMainWindow() {
    this.mainWindow = new this.electron.BrowserWindow({
      width: 1280,
      height: 720,
      title: 'Bakaru',
      frame: false,
      icon: this.rootDir + '/icon.png',
      webPreferences: {
        experimentalFeatures: true,
        blinkFeatures: 'CSSBackdropFilter'
      }
    });

    this.mainWindow.loadURL(this.mainWindowUrl + '?wcjsPath=' + encodeURIComponent(this.pathDispatcher.wcjs));

    if (this.runningDevMode) {
      this.mainWindow.webContents.openDevTools({
        detach: true
      });
    }

    this.mainWindow.on('focus', () => {
      this.mainWindow.flashFrame(false);
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  /**
   * Makes sure Bakaru running single instance
   *
   * @private
   */
  _singleInstance() {
    this.makeSingleInstance() && this.app.quit();
  }

  /**
   * Setup app events listeners
   *
   * @private
   */
  _setupAppEventListeners() {
    this.ipc.on(this.events.main.minimizeMainWindow, () => {
      this.mainWindow.minimize();
    });

    this.app.on('ready', this.createMainWindow.bind(this));

    this.app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        this.app.quit();
      }
    });

    this.app.on('activate', () => {
      if (this.mainWindow === null) {
        this.createMainWindow();
      }
    });
  }
}

module.exports = App;
