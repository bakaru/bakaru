'use strict';

const PathDispatcher = require('./PathDispatcher');

/**
 * @param {App} app
 * @returns {PathDispatcher}
 */
function createPathDispatcher(app) {
  return new PathDispatcher(app);
}

module.exports = createPathDispatcher;