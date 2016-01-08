import setupIpcListener from 'lib/ipcListener';

export default class App {
  constructor (electron, rootDir) {
    this.electron = electron;
    this.rootDir = rootDir;
    this.app = electron.app;
    this.ipc = electron.ipcMain;

    this.mainWindow = null;

    setupIpcListener(this.ipc, () => {
      return this.mainWindow;
    });
    this._setupAppEvenetListeners();
  }

  createMainWindow () {
    this.mainWindow = new this.electron.BrowserWindow({
      width: 850,
      height: 720,
      title: 'Bakaru',
      frame: false
    });

    // and load the index.html of the app.
    this.mainWindow.loadURL('file:///app/gui/index.html');

    // Open the DevTools.
    this.mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    this.mainWindow.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this.mainWindow = null;
    });
  }

  _setupAppEvenetListeners () {
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
        createWindow();
      }
    });
  }
}
