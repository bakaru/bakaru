// Setup globals
global['bakaru'] = {
  debug: false,
  paths: {},
  addresses: [],
  pm: null
};

// Setup debug info
if (process.argv.filter(arg => arg.trim() === 'debug').length) {
  // Instruct debug logger
  process.env['DEBUG'] = 'bakaru*';
  global.bakaru.debug = true;
}

// Main components
import setupPaths from './bootstrap/setupPaths';
import bootServer from './server';

// Main boot sequence
(async () => {
  await setupPaths();

  bootServer();
})();

// Error handler
process.on('uncaughtException', e => {
  console.error(e);

  process.exit(1);
});
