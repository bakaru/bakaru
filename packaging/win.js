'use strict';

const pkg = require('../package.json');
const path = require('path');
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
  outputDirectory: `build/dist-${pkg.version}/win`,
  authors: 'Alexander Kukhta',
  iconUrl: './icon.ico',
  noMsi: true
};

log('Packaging win app...');

console.log(path.resolve(__dirname, `../build/win/${packagerConfig.name}-${packagerConfig.platform}-${packagerConfig.arch}`));

module.exports = packager(packagerConfig)//Promise.resolve('C:\\Users\\alexr_000\\Documents\\Projects\\bakaru\\build\\win\\Bakaru-win32-ia32')
  .then(appDirectory => {
    appDirectory = path.resolve(__dirname, `../build/win/${packagerConfig.name}-${packagerConfig.platform}-${packagerConfig.arch}`);

    log('Creating win installer... ');
    return installer(Object.assign({ appDirectory }, installerConfig));
  })
  .then(() => log('Done.'));
