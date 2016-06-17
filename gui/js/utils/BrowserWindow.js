
class BrowserWindow {

  /**
   * Ctor
   *
   * @param remote
   */
  constructor(remote) {
    this.remote = remote;
  }

  /**
   * @private
   * @returns {*}
   */
  self() {
    return this.remote.getCurrentWindow();
  }

  minimize() {
    this.self().minimize();
  }

  maximize() {
    this.self().maximize();
  }

  isMaximized() {
    return this.self().isMaximized();
  }

  getContentSize() {
    return this.self().getContentSize();
  }

  getWindowSize() {
    return this.self().getSize();
  }

  getBounds() {
    return this.self().getBounds();
  }

  setWindowSize(width, height) {
    this.self().setSize(width, height, true);
  }

  setProgressBar(value) {
    this.self().setProgressBar(value);
  }

  enterFullScreen() {
    this.self().setFullScreen(true);
  }

  exitFullScreen() {
    this.self().setFullScreen(false);
  }

  isFullScreen() {
    return this.self().isFullScreen();
  }

  enableAlwaysOnTop() {
    this.self().setAlwaysOnTop(true);
  }

  disableAlwaysOnTop() {
    this.self().setAlwaysOnTop(false);
  }

  isAlwaysOnTop() {
    return this.self().isAlwaysOnTop();
  }

  flashFrame() {
    this.self().flashFrame(true);
  }

  setPosition(x, y) {
    this.self().setPosition(x, y, true);
  }

  getPosition() {
    return this.self().getPosition();
  }

  center() {
    this.self().center();
  }

  setTitle(title) {
    this.self().setTitle(title);
  }
}

export default new BrowserWindow(require('electron').remote);