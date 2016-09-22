const expect = require('chai').expect;

const fakefs = require('./fakefs');

beforeEach(fakefs.override);
afterEach(fakefs.restore);

describe('seriesEntry()', () => {
  it('should be accessible', () => {
    expect(() => {
      require('../../../../../app/Server/Plugins/FolderReader/makers/seriesEntry');
    }).not.throw(Error);
  });

  const makeSeriesEntry = require('../../../../../app/Server/Plugins/FolderReader/makers/seriesEntry');

  it('should make series entry', () => {
    return makeSeriesEntry('onlySeries/s1', {
      videos: [
        'e1.mkv',
        'e2.mkv',
        'e3.mkv'
      ]
    }).then(entry => {
      expect(entry.voiceOvers.size).eq(3);
      expect(entry.subtitles.size).eq(1);
    });
  });
});
