import * as debug from 'debug'
import * as electron from 'electron'
import icon from './icon'

const log = debug('bakaru:window');

export default class Window {
  public runningDevMode: boolean;
  public mainWindow: Electron.BrowserWindow;

  protected app: Electron.App;
  protected name: string;
  protected rootDir: string;
  protected electron: Electron.AllElectron;
  protected mainWindowUrl: string;
  protected mainWindowOptions: Electron.BrowserWindowConstructorOptions;

  constructor() {
    this.name = 'Bakaru';

    this.electron = electron;
    this.app = electron.app;
    this.app.setName(this.name);

    this._singleInstance();

    this.rootDir = __dirname;

    this.mainWindow = null;
    this.mainWindowOptions = {
      width: 1000,
      height: 563,
      title: this.name,
      frame: false,
      icon: this.electron.nativeImage.createFromDataURL(icon),
      webPreferences: {
        plugins: true,
        experimentalFeatures: true,
        blinkFeatures: 'CSSBackdropFilter'
      }
    };

    log('Constructing WindowController');

    this._setupAppEventListeners();
  }

  /**
   * @private
   * @returns {*}
   */
  makeSingleInstance() {
    return this.app.makeSingleInstance(() => {
      if (this.mainWindow) {
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
    log('Creating main window');

    this.mainWindow = new this.electron.BrowserWindow(
      this.mainWindowOptions
    );

    this.mainWindow.loadURL(`${global.bakaru.paths.mainWindowUrl}`);

    if (global.bakaru.debug) {
      this.mainWindow.webContents.openDevTools({
        mode: "detach"
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
    if (electron.app.isReady()) {
      this.createMainWindow();
    } else {
      electron.app.on('ready', this.createMainWindow.bind(this));
    }

    electron.app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        this.app.quit();
      }
    });

    electron.app.on('activate', () => {
      if (this.mainWindow === null) {
        this.createMainWindow();
      }
    });
  }
}
