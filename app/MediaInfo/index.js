'use strict';

const path = require('path');
const MediaInfo = require('./MediaInfo');

function createMediaInfo(app) {
  const mediaInfoExecutablePath = path.join(app.pathDispatcher.thirdParty, 'MediaInfo', 'MediaInfo.exe');

  return new MediaInfo(mediaInfoExecutablePath);
}

module.exports = createMediaInfo;