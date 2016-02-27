'use strict';

const cp = require('node-cp');
const fs = require('fs');
const cmd = require('child_process');
const path = require('path');
const chalk = require('chalk');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const packager = require('electron-packager');

const noop = ()=>{};
const log = msg => console.log(chalk.green(msg));

var GUI_BUILD = './build/staging/gui/build/';

const winBuild = `cross-env GUI_BUILD=${GUI_BUILD} webpack -p`;

var promise = Promise.resolve(noop);

promise = promise.then(() => {
  log('Cleaning staging folder...');
  return (new Promise(resolve => {
    rimraf('./build/staging', () => resolve());
  })).then(() => {
    log('Done.');
  });
});

promise = promise.then(() => {
  log('Packing sources...');
  cmd.execSync(winBuild);
  log('Done.');
});

promise = promise.then(() => {
  var cpPromise = Promise.resolve(noop);

  log('Copying files...');

  cpPromise = cpPromise.then(() => {
    return new Promise(resolve => {
      cp('./package.json', './build/staging/', () => resolve());
    });
  });
  cpPromise = cpPromise.then(() => {
    return new Promise(resolve => {
      cp('./app', './build/staging/app/', () => resolve());
    });
  });
  cpPromise = cpPromise.then(() => {
    return new Promise(resolve => {
      cp('./gui/index.html', './build/staging/gui/', () => resolve());
    });
  });

  cpPromise = cpPromise.then(() => {
    return new Promise(resolve => {
      cp('./thirdparty', './build/staging/thirdparty/', () => resolve());
    });
  });

  return cpPromise.then(() => {
    log('Done.');
  });
});

promise = promise.then(() => {
  log('Installing deps...');
  cmd.execSync(`cd ./build/staging && npm i --production`);
  log('Done.');
});

promise = promise.then(() => {
  log('Packaging app...');

  return (new Promise((resolve, reject) => {
    packager({
      name: 'Bakaru',
      'build-version': process.env.npm_package_version,
      'app-version': process.env.npm_package_version,
      out: './build/packed',
      arch: 'ia32',
      dir: './build/staging',
      platform: 'win32',
      version: '0.36.5',
      asar: false,
      overwrite: true,
      icon: './icon.ico'
    }, (err, appPath) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(appPath);
      }
    });
  })).then(() => log('Done.'));
});
