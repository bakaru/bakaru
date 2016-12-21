import * as mock from 'mock-fs';
import { expect } from 'chai';
import 'mocha';

afterEach(mock.restore);

import Syncer from './Syncer';

describe('Syncer', () => {
  it('should construct with empty lib', () => {
    mock({
      root: {
        'library.arson': ''
      }
    });

    const syncer = new Syncer('root');

    expect(syncer.libPath).equal('root/library.arson');
  });

  it('should construct without lib', () => {
    mock({
      root: {}
    });

    const syncer = new Syncer('root');

    expect(syncer.libPath).equal('root/library.arson');
  });

  it('should resurrect with empty lib', async () => {
    mock({
      root: {
        'library.arson': '[["Set"]]'
      }
    });

    const syncer = new Syncer('root');
    const lib = await syncer.resurrect();

    expect(lib.size).equal(0);
  });

  it('should resurrect with empty lib', async () => {
    mock({
      root: {
        'library.arson': '[["Set",1],"test"]'
      }
    });

    const syncer = new Syncer('root');
    const lib = await syncer.resurrect();

    expect([...lib]).include.members(['test']);
  });
});
