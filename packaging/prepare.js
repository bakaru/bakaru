'use strict';

const bluebird = require('bluebird');

const cp = bluebird.promisify(require('node-cp'));
const fs = require('fs');
const cmd = bluebird.promisify(require('child_process').exec);
const chalk = require('chalk');
const rimraf = bluebird.promisify(require('rimraf'));
const mkdirp = bluebird.promisify(require('mkdirp'));
const webpack = bluebird.promisify(require('webpack'));

const log = msg => console.log(chalk.green(msg));

process.env.GUI_BUILD = './build/app/gui/build/';

const webpackConfig = require('../webpack.config');

module.exports = Promise.resolve()
  .then(() => {
    log('Cleaning build app folder...');
    return rimraf('./build/app');
  })
  .then(() => {
    log('Packing sources...');
    return webpack(webpackConfig);
  })
  .then(() => {
    log('Copying files...');
    return cp('./package.json', './build/app/');
  })
  .then(() => cp('./app', './build/app/app/'))
  .then(() => cp('./gui/index.html', './build/app/gui/'))
  .then(() => {
    log('Installing deps...');
    return cmd(`cd ./build/app && npm i --production`);
  });
