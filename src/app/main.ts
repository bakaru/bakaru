import App from './App';
import electron = require('electron');

const app: App = new App(electron);

process.on('uncaughtException', e => {
  console.error(e);
  
  process.exit(1);
});
