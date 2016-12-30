import * as path from 'path';
import 'mocha';

const chai = require('chai');
import shallow = require('chai-shallow-deep-equal');

chai.use(shallow);

const expect = chai.expect;

// On windows we need to point to exe file
if (process.platform === 'win32') {
  // Setup globals
  global['bakaru'] = {
    debug: true,
    paths: {},
    addresses: [],
    pm: null
  };

  // Bootstrapping paths so VideoInfo could use ffprobe path
  require('../../bootstrap/setupPaths');
}

const testFilePath = path.resolve(__dirname, 'stubs', 'test.mkv');
const testFileParsedMedia: ParsedMedia = {
  size: 1052413,
  video:     {
    codec: 'mpeg4',
    width: 1280,
    height: 720,
    startTime: 0,
    bitsPerPixel: '8'
  },
  audios: [{
    bitRate: -1,
    codec: 'aac',
    channels: 6,
    'default': true,
    forced: false
  }],
  duration: 3.6,
  chapters: [],
  subtitles: []
};

import VideoInfo from './VideoInfo';

describe('VideoInfo', () => {
  it('should instantiate', () => {
    expect(() => {
      new VideoInfo();
    }).to.not.throw(Error);
  });

  it('should parse media', async (): Promise<void> => {
    const vi = new VideoInfo();

    const media = await vi.get(testFilePath).catch(console.error);

    expect(media).to.not.be.undefined;
    expect(media).to.shallowDeepEqual(testFileParsedMedia);

    return;
  });
});
