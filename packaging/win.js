'use strict';

const bluebird = require('bluebird');

const fancyLog = require('./fancy-log');
const fs = bluebird.promisifyAll(require('fs-extra'));
const pkg = require('../package.json');
const path = require('path');
const chalk = require('chalk');
const packager = bluebird.promisify(require('electron-packager'));

const packagerConfig = {
  name: 'Bakaru',
  'build-version': pkg.version,
  'app-version': pkg.version,
  out: './build/portable',
  arch: 'ia32',
  dir: './build/app',
  platform: 'win32',
  version: '0.36.7',
  asar: false,
  overwrite: true,
  icon: './icon.ico',
  'version-string': {
    'FileDescription': 'Bakaru',
    'OriginalFilename': 'Bakaru.exe',
    'ProductName': 'Bakaru'
  }
};
const vendorSrc = path.join(__dirname, '../vendor');

let stopPackagingAppLog = fancyLog('Packaging win app');
let stopCopyingVendorLog;

module.exports = packager(packagerConfig)
  .then(packagedPaths => {
    stopPackagingAppLog();

    return packagedPaths;
  })
  .then(packagedPaths => {
    stopCopyingVendorLog = fancyLog('Copying vendor to apps');

    return Promise.all(
      packagedPaths.map(packagedPath => {
        const vendorDest = path.join(__dirname, '..', packagedPath, 'resources/vendor');

        return fs.copyAsync(vendorSrc, vendorDest);
      })
    );
  })
  .then(() => {
    stopCopyingVendorLog();
  })
  .then(() => console.log(chalk.yellow(`Done,\nDon't forget to compile nsis installer!`)));
