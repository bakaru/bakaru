import { app } from 'electron';
import { join } from 'path';
import { promisify } from 'bluebird';
import * as mkdirp from 'mkdirp';
const makeDir = promisify(mkdirp);

const vendors = global.bakaru.debug
  ? join(__dirname, '..', '..', '..', 'vendor')
  : join(app.getAppPath(), '..', '..', '..', 'vendor');

global.bakaru.paths.wcjs = join(vendors, 'wcjs');
global.bakaru.paths.ffmpeg = join(vendors, 'ffmpeg');

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
