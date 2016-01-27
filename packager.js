'use strict';

const chalk = require('chalk');
const mkdirp = require('mkdirp');
const packager = require('electron-packager');
const childProcess = require('child_process');

console.log(childProcess.execSync('git branch -l').toString());

