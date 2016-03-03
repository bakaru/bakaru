'use strict';

const pkg = require('../package.json');
const chalk = require('chalk');
const bluebird = require('bluebird');
const packager = bluebird.promisify(require('electron-packager'));
const installer = require('electron-winstaller').createWindowsInstaller;

const log = msg => console.log(chalk.green(msg));

const packagerConfig = {
  name: 'Bakaru',
  'build-version': pkg.version,
  'app-version': pkg.version,
  out: './build/win',
  arch: 'ia32',
  dir: './build/app',
  platform: 'win32',
  version: '0.36.5',
  asar: false,
  overwrite: true,
  icon: './icon.ico',
  'version-string': {
    'FileDescription': 'Bakaru',
    'OriginalFilename': 'Bakaru.exe',
    'ProductName': 'Bakaru'
  }
};

const installerConfig = {
  outputDirectory: `./build/dist-${pkg.version}/win`,
  authors: 'Alexander Kukhta',
  iconUrl: './icon.ico',
  noMsi: true
};

log('Packaging win app...');

module.exports = Promise.resolve()//packager(packagerConfig)
  .then(appDirectory => {
    log('Creating win installer...');
    return installer(Object.assign({ appDirectory }, installerConfig));
  })
  .then(() => log('Done.'));
