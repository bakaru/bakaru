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

var APP_BUILD = './build/staging/';
var GUI_BUILD = './build/staging/app/gui/build/';

const winBuild = `set APP_BUILD=${APP_BUILD} && set GUI_BUILD=${GUI_BUILD} && webpack -p`;

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
      cp('./app/gui/index.html', './build/staging/app/gui/', () => resolve());
    });
  });

  return cpPromise.then(() => {
    log('Done.');
  });
});

promise = promise.then(() => {
  log('Packaging electron app...')

  return (new Promise((resolve, reject) => {
    packager({
      name: 'Bakaru',
      out: './build/packed',
      arch: 'x64',
      dir: './build/staging',
      platform: 'win32',
      version: '0.36.5',
      asar: true,
      overwrite: true
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


