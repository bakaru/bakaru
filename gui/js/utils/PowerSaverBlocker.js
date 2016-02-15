
class PowerSaverBlocker {
  constructor(remote) {
    this.psb = remote.powerSaverBlocker;
  }

  start(type = 'prevent-display-sleep') {
    return this.psb.start(type);
  }

  stop(id) {
    this.psb.stop(id);
  }

  isStarted(id) {
    return this.psb.isStarted(id);
  }
}

export default new PowerSaverBlocker(require('electron').remote);