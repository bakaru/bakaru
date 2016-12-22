import * as mock from 'mock-fs';
import { expect } from 'chai';
import 'mocha';
import * as bb from 'bluebird';

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

  it('should resurrect with filled lib', async () => {
    mock({
      root: {
        'library.arson': '[["Set",1],"test"]'
      }
    });

    const syncer = new Syncer('root');
    const lib = await syncer.resurrect();

    expect([...lib]).include.members(['test']);
  });

  it('should read entry', async () => {
    mock({
      root: {
        'test.arson': '[{"id":1},"test"]'
      }
    });

    const syncer = new Syncer('root');
    const entry = await syncer.read('test');

    expect(entry.id).equal('test');
  });

  it('should write entry', async () => {
    mock({
      root: {
        'test.arson': '[{"id":1},"test"]'
      }
    });

    const entry: Entry = {
      id: 'test',
      path: 'test',
      title: 'test',
      width: 1,
      height: 1,
      bitDepth: '8',
      episodes: new Map<string, Episode>(),
      subtitles: new Map<string, Subtitles>(),
      voiceOvers: new Map<string, VoiceOver>(),
      defaultSubtitles: 'test',
      defaultVoiceOver: 'test'
    };

    const syncer = new Syncer('root');

    syncer.write('test', entry);
    expect(syncer.lib.has('test')).equal(true);

    // Waiting for write to complete
    await bb.delay(200);

    const savedEntry = await syncer.read('test');

    expect(savedEntry.id).equal('test');
    expect(savedEntry.title).equal('test');
  });
});
