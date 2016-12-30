import * as mock from 'mock-fs';
import * as path from 'path';
import { expect } from 'chai';
import 'mocha';
import * as bb from 'bluebird';

afterEach(mock.restore);

import FS from './FS';

describe('FS', () => {
  it('should construct with empty lib', () => {
    mock({
      root: {
        'library.arson': ''
      }
    });

    const syncer = new FS('root');

    expect(syncer.libPath).equal(path.join('root', 'library.arson'));
  });

  it('should construct without lib', () => {
    mock({
      root: {}
    });

    const syncer = new FS('root');

    expect(syncer.libPath).equal(path.join('root', 'library.arson'));
  });

  it('should resurrect with empty lib', async (): Promise<void> => {
    mock({
      root: {
        'library.arson': '[["Set"]]'
      }
    });

    const syncer = new FS('root');
    const lib = await syncer.resurrect();

    expect(lib.size).equal(0);

    return;
  });

  it('should resurrect with filled lib', async (): Promise<void> => {
    mock({
      root: {
        'library.arson': '[["Set",1],"test"]'
      }
    });

    const syncer = new FS('root');
    const lib = await syncer.resurrect();

    expect([...lib]).include.members(['test']);
  });

  it('should read entry', async (): Promise<void> => {
    mock({
      root: {
        'test.arson': '[{"id":1},"test"]'
      }
    });

    const syncer = new FS('root');
    const entry = await syncer.read('test');

    expect(entry.id).equal('test');

    return;
  });

  it('should write entry', async (): Promise<void> => {
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

    const syncer = new FS('root');

    syncer.write('test', entry);
    expect(syncer.lib.has('test')).equal(true);

    // Waiting for write to complete
    await bb.delay(200);

    const savedEntry = await syncer.read('test');

    expect(savedEntry.id).equal('test');
    expect(savedEntry.title).equal('test');

    return;
  });
});
