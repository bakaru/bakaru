import FS from './lib/FS';

/**
 * Boots up Syncer
 *
 * @returns {FS}
 */
function bootSyncer(): FS {
  return new FS(global.bakaru.paths.library);
}

export interface LibraryInterface {
  getAll?(): Map<string, Entry>
  getOne?(entryId: string): Entry
}

export default class Library implements LibraryInterface {

}
