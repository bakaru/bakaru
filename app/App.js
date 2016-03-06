'use strict';

const events = require('./events');

const createPathDispatcher = require('./PathDispatcher');
const createMediaInfo = require('./MediaInfo');
const createFolderReader = require('./FolderReader');

const icon  = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAALRSURBVGhD3djPi41RHMfxr2KnbBT5B6z8XFmxUxbKjyKx8CO3+z2P0EiSGGFDUcOCFFmxEsrKilAs/R72oixYKDZ6fO/cufece3tf58y9ZxbH4lXPfJ7Pmed7mjvPM89IXdf/BQxLhGGJMCwRhiXCsEQYlgjDEmFYIgyzkGpZLe5bF3UywjCL9kbsaErJG2kuDTbyCTsZYZhF70beYScjDLPo3ch77GSEYRa9G/mAnYwwTCJufi2NhYM11wQbmeTOAOF1EmGYRNzlYNCM9AleLwLDJLO2EfcQrxeBYRLR7fasONXLjbfpaXMtGO6NOcnU1jXv2fF0V+/g9SIwzEJ0UzDcJex0iO4JutexE4FhFqKH/HDuKHY6ejdyBTsRGGYh1YVguAZ2OsTtDrr//ukNgGEW4m764dw27HSI2xF0z2MnAsMsxD3ww9kfkOG5flJt9V09i50IDLMQ93x6sD/21RzsdIjb6Tdid7LwXCIMRyaNBcFgr7ATEt3n+3oMOxEYjkya4UflBnZCos73q8PYicBwZOKu+sHsYxOeI6Jjvm+bCs8lwnBkrRcpv5HF2AmJnvB93YWdCAxHIm6lH8p+4cNzg4g759foRuxEYDgS0ft+KLcfO/2keTFYsxY7ERgOTXRLMNCPWsbnYq+f6C2/TpdjJwLDoYm+DgY6jh0i+syvq5ZgJwLDoYg74odxj7EziOhXv7YxDzsRGM6YNFfZMD/9MNVq7JHWXa27Tr9jJwGGMyK63ob4FQyT/pFqkWqzX+vuYicBhsla93w/hNFH2BukdYcS/Rh8j73YS4BhkvarrR11N3Ebex2iE+aFdV+aSTv+0rf+dy0HF+HaBBhGia7rGyL+Vtf7oAQHNuC6RBgmab0sTQ1QjeF5IvrZ1tjzRd+ap8YennrGNrEC+zOAYbIh/5k2GzAsEYYlwrBEGJYIwxJhWCIMS4RhiTAsTy1/AcGnKih5Fy/9AAAAAElFTkSuQmCC`;

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
      icon: this.electron.nativeImage.createFromDataUrl(icon),
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
