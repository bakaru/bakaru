const expect = require('chai').expect;

const fakefs = require('./fakefs');

beforeEach(fakefs.override);
afterEach(fakefs.restore);

describe('readFlatTree()', () => {
  it('should be accessible', () => {
    expect(() => {
      require('../../../../../app/Server/Plugins/FolderReader/readFlatTree');
    }).not.throw(Error);
  });

  const readFlatTree = require('../../../../../app/Server/Plugins/FolderReader/readFlatTree');

  it('should build flat tree', () => {
    return readFlatTree('onlySeries/s1').then(flatTree => {
      expect([...flatTree.keys()]).has.members([
        'onlySeries/s1',
        'onlySeries/s1/subs',
        'onlySeries/s1/dubs',
        'onlySeries/s1/dubs/dub1',
        'onlySeries/s1/dubs/dub2'
      ]);
    });
  });
});
