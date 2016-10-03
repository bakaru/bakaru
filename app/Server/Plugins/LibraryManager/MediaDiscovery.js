const FPQ = require('fastpriorityqueue');
const path = require('path');
const RootApp = require('electron').app;
const bluebird = require('bluebird');
const childProcesses = bluebird.promisifyAll(require('child_process'));

const coreObjectsCreators = require('../coreObjectsCreators');

const ffProbePath = path.join(
  RootApp.getPath('userData'),
  `ffmpeg/ffprobe${process.platform === 'win32' ? '.exe' : ''}`
);
const ffProbeArgs = [
  '-of json', // output format - JSON
  '-v quiet', // silence you bitch
  '-show_chapters',
  '-show_streams',
  '-show_format',
  '-show_data' // Wut? Why the fuck we need it?!
];

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

function parseTime(timeString) {
  return parseInt(parseFloat(timeString) * 1000, 10);
}

function parseVideoStream(video) {

}

function parseAudioStream(audio) {

}

/**
 * Parses chapters to suitable objects
 *
 * @param {{}[]} chapters
 * @returns {Chapter[]}
 */
function parseChapters(chapters) {
  if (chapters.length === 0) {
    return [];
  }

  return chapters.map(rawChapter => {
    let title = '';

    // An attempt to get fine title for chapter
    if (rawChapter.tags) {
      if (rawChapter.tags.title) {
        title = rawChapter.tags.title.toString().trim();
      }
    }

    const start = parseTime(rawChapter.start_time);
    const end = parseTime(rawChapter.end_time);

    return coreObjectsCreators.chapter(title, start, end);
  });
}

/**
 * Extracts all the freaking media props from ffProbe output
 *
 * @param {string} rawOutput
 */
function mediaPropertiesExtractor(rawOutput) {
  /**
   * @type {{streams: {}[], chapters: {}[], format: {}}}
   */
  const jsonMediaProperties = JSON.parse(rawOutput);

  const properties = {
    width: 0,
    height: 0,
    bitDepth: 0,
    codec: '',
    chapters: [],
    subtitles: [],
    voiceOvers: []
  };

  properties.chapters = parseChapters(jsonMediaProperties.chapters);
}

/**
 * FFProbe file
 *
 * @param {string} filePath
 * @returns {Promise}
 */
function processFile(filePath) {
  return childProcesses
    .execFileAsync(ffProbePath, ffProbeArgs.concat([`-i ${filePath}`]))
    .then(mediaPropertiesExtractor);
}

class MediaDiscovery {

  /**
   * Ctor
   */
  constructor() {
    this.queue = new FPQ(FPQComparator);
    this.queueing = false;
  }

  /**
   * Enqueue media discovery task
   *
   * @param {string[]} paths
   * @param {number} priority
   * @returns {Promise<{}>}
   */
  enqueue(paths, priority = MediaDiscovery.LowPriority) {
    return new Promise((resolve, reject) => {
      this.queue.add([
        priority,
        paths,
        resolve,
        reject
      ]);

      this.work();
    });
  }

  work() {
    if (this.queueing) {
      return false;
    }

    this.queueing = true;

    this.processQueue();
  }

  /**
   * Asynchronous queue processing
   */
  processQueue() {bluebird.coroutine((function *() {
    while (this.queue.isEmpty() === false) {
      const [, paths, resolve, reject] = this.queue.poll();

      try {
        resolve(yield this.processFiles(paths));
      } catch(err) {
        reject(err);
      }
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
    return Promise.all(paths.map(processFile));
  }
}

MediaDiscovery.HighPriority = 1;
MediaDiscovery.LowPriority = 0;

module.exports = MediaDiscovery;
