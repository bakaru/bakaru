import { app } from 'electron'
import { join } from 'path'
import { promisify } from 'bluebird'
import * as mkdirp from 'mkdirp'

const makeDir = promisify(mkdirp);

const prodPath = join(app.getAppPath(), '../app.asar.unpacked/vendor');
const devPath = join(__dirname, '..', '..', '..', 'vendor');

const vendors = global.bakaru.debug
  ? devPath
  : prodPath;

global.bakaru.paths.mpv = vendors;
process.env.path = `${global.bakaru.paths.mpv};${process.env.path}`;
global.bakaru.paths.ffmpeg = vendors;

const data = global.bakaru.paths.data = join(app.getPath('userData'));

global.bakaru.paths.temp = join(data, 'BakaruTemp');
global.bakaru.paths.library = join(data, 'BakaruLibrary');
global.bakaru.paths.preferences = join(data, 'BakaruPreferences');

export default async function setup(): Promise<void> {
  await makeDir(global.bakaru.paths.temp);
  await makeDir(global.bakaru.paths.library);
  await makeDir(global.bakaru.paths.preferences);

  return;
}
