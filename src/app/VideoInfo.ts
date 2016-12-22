import * as path from 'path';
import * as Bluebird from 'bluebird';
import { execFile } from 'child_process';
import FastPriorityQueue = require('fastpriorityqueue');

type FuckingPromise<T> = Promise<T> | Bluebird<T>;
type QueueItem = Array<any>;

const execFileAsync = Bluebird.promisify<string, string, string[]>(execFile);

const ffProbePath = path.join(
  global.bakaru.paths.ffmpeg,
  `ffprobe${process.platform === 'win32' ? '.exe' : ''}`
);
const ffProbeArgs = [
  '-of json', // output format - JSON
  '-v quiet', // silence you bitch
  '-show_chapters',
  '-show_streams',
  '-show_format',
  '-show_data' // Wut? Why the fuck we need it?!
];

function FPQComparator(a: QueueItem, b: QueueItem): boolean {
  return a[0] < b[0];
}

function mediaPropertiesExtractor(raw: string): MediaProperties {
  const props: MediaProperties = {
    width: 0,
    height: 0,
    bitDepth: 0,
    codec: '',
    chapters: [],
    subtitles: [],
    voiceOvers: []
  };

  return props;
}

function processFile(filePath: string): FuckingPromise<MediaProperties> {
  return execFileAsync(ffProbePath, ffProbeArgs.concat([`-i ${filePath}`]))
    .then(mediaPropertiesExtractor);
}

export enum Priority {
  LowPriority = 1,
  HighPriority = 2
}

export default class VideoInfo {
  protected queue = new FastPriorityQueue(FPQComparator);
  protected queueing = false;

  public get(paths: string[], priority: number = Priority.LowPriority): Promise<any> {
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

  protected work(): void {
    if (!this.queueing) {
      this.queueing = true;
      this.processQueue();
    }
  }

  protected async processQueue(): Promise<void> {
    while (!this.queue.isEmpty()) {
      const [, paths, resolve, reject] = this.queue.poll();

      try {
        resolve(await this.processFiles(paths));
      } catch(e) {
        reject(e);
      }
    }

    this.queueing = false;
  }

  protected async processFiles(paths: string[]): Promise<any> {
    return Promise.all(paths.map(processFile));
  }
}
