const FPQ = require('fastpriorityqueue');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const RootApp = require('electron').app;
const bluebird = require('bluebird');

const coreEvents = require('../coreEvents');

// FIXME: Fix this executable motherfucker...
const executablePath = path.join(RootApp.getPath('userData'), 'ffmpeg/ffprobe.exe');

/**
 * Priority queue comparator
 *
 * @param a
 * @param b
 * @returns {boolean}
 */
function FPQComparator(a, b) {
  return a[0] < b[0];
}

function executioner(paths) {

}

class MediaDiscovery {

  /**
   * Ctor
   *
   * @param {ServerContext} context
   */
  constructor(context) {
    this.queue = new FPQ(FPQComparator);
    this.events = context.events;
    this.queueing = false;

    this.ffmpeg = ffmpeg();
    this.ffmpeg.setFfprobePath(path.join(executablePath));
  }

  enqueue(paths, priority = MediaDiscovery.LowPriority) {
    this.queue.add([priority, paths instanceof Array ? paths : [paths]])
  }

  work() {
    if (this.queueing) {
      return false;
    }

    this.queueing = true;

    bluebird.coroutine(this.processQueue())();
  }

  /**
   * Asynchronous queue processing
   */
  processQueue() {bluebird.coroutine((function *() {
    while (this.queue.isEmpty() === false) {
      const paths = this.queue.poll()[1];

      this.events.emit(
        coreEvents.mediaRead,
        yield this.processFiles(paths)
      );
    }

    this.queueing = false;
  }).bind(this))()}

  /**
   * Processes files
   *
   * @param paths
   * @returns {Promise<{}[]>}
   */
  processFiles(paths) {
    return Promise.all(paths.map(filePath => {
      return new Promise(resolve => {
        this.ffmpeg.ffprobe(filePath, ['-show_chapters'], (err, info) => {
          resolve(info);
        });
      });
    }));
  }
}

MediaDiscovery.HighPriority = 1;
MediaDiscovery.LowPriority = 0;

module.exports = MediaDiscovery;
