'use strict';

const App = require('./App');
const electron = require('electron');

const app = new App(electron);

process.on('uncaughtException', e => {
  console.error(e);
  
  process.exit(1);
});
