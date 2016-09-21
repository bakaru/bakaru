const expect = require('chai').expect;

const fakefs = require('./fakefs');
const EE = require('events').EventEmitter;

beforeEach(fakefs.override);
afterEach(fakefs.restore);

describe('FolderReader', () => {
  it('should be accessible', () => {
    expect(() => {
      require('../../../../../app/Server/Plugins/FolderReader');
    }).not.throw(Error);
  });

  const FolderReader = require('../../../../../app/Server/Plugins/FolderReader');

  /**
   *
   * @returns {FolderReader}
   */
  function makeFR() {
    return new FolderReader({ events: new EE()});
  }

  describe('#readFolder()', () => {
    it('should read folder', () => {
      const fr = makeFR();

      fr.processSeries = () => {};

      return fr.readFolder('onlySeries').then(classes => {
        expect(classes.folders).has.members(['onlySeries/s1', 'onlySeries/s2']);
      });
    });

    it('should read series folder', () => {
      const fr = makeFR();

      fr.processSeries = () => {};

      return fr.readFolder('onlySeries/s1').then(classes => {
        expect(classes.videos).has.members([
          'onlySeries/s1/e1.mkv',
          'onlySeries/s1/e2.mkv',
          'onlySeries/s1/e3.mkv'
        ]);
      });
    });
  });
});
