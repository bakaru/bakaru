import * as path from 'path';
import { execFile, exec } from 'child_process';
import FastPriorityQueue = require('fastpriorityqueue');
import extractProperties, { Media } from './FFMpegPropertiesExtractor';

type QueueItem = Array<any>;

const execFileAsync = (fpath: string, args: string[]): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    execFile(fpath, args, (error: string|null|Error, stdout: string|Buffer) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.toString());
      }
    });
  });
};

const execAsync = (cmd: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    exec(cmd, (error: string|null|Error, content: string|Buffer) => {
      if (error) {
        reject(error);
      } else {
        resolve(content.toString());
      }
    });
  });
};

const ffProbeArgs = [
  '-of', 'json', // output format - JSON
  '-v', 'quiet', // silence you bitch
  '-show_chapters',
  '-show_streams',
  '-show_format'
];

let ffprobe: ((filePath: string) => Promise<string>) = null;

switch (process.platform) {
  case 'win32':
    const ffProbePath = path.join(global.bakaru.paths.ffmpeg, 'ffprobe.exe');

    ffprobe = (filePath: string): Promise<string> => {
      return execFileAsync(ffProbePath, ffProbeArgs.concat(['-i', filePath]));
    };

    break;

  default:
    ffprobe = (filePath: string): Promise<string> => {
      return execAsync(`ffprobe ${ffProbeArgs.concat(['-i', filePath]).join(' ')}`);
    };
    break;
}

function FPQComparator(a: QueueItem, b: QueueItem): boolean {
  return a[0] < b[0];
}

function processFile(filePath: string): Promise<ParsedMedia> {
  return ffprobe(filePath).then(
    media => extractProperties(<Media>JSON.parse(media))
  );
}

export interface VideoInfoInterface {
  get?(filePath: string, priority?: number): Promise<ParsedMedia>
}

export enum Priority {
  LowPriority = 1,
  HighPriority = 2
}

export default class VideoInfo implements VideoInfoInterface {
  protected queue = new FastPriorityQueue(FPQComparator);
  protected queueing = false;

  public get(filePath: string, priority: number = Priority.LowPriority): Promise<ParsedMedia> {
    return new Promise<ParsedMedia>((resolve, reject) => {
      this.queue.add([
        priority,
        filePath,
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
      const [, path, resolve, reject] = this.queue.poll();

      try {
        resolve(await processFile(path));
      } catch(e) {
        reject(e);
      }
    }

    this.queueing = false;
  }
}
