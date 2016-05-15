import anime from './stubs/oneAnime';

import { normalize } from 'path';
import { readdirSync } from 'fs';

import IC from '../../../app/FolderReader/ItemsClassificator';
import RAFS from '../../../app/FolderReader/RecursiveAnimeFolderScanner';

import { should } from 'chai';
should();

beforeEach(() => {
  anime.override();
});

afterEach(() => {
  anime.restore();
});

describe('RecursiveAnimeFolderScanner', () => {

  describe('#scan()', () => {
    it('should scan', () => {
      const path = anime.root + '/' + anime.title;
      const items = readdirSync(path);

      return IC(path, items)
        .then(classifiedItems => RAFS.scan({ dubs: [], subs: [] }, classifiedItems.folders))
        .then(animeFolder => {
          animeFolder.dubs.length.should.equal(anime.dubs.length);
          animeFolder.subs.length.should.equal(anime.subs.length);
        });
    });
  });

});


