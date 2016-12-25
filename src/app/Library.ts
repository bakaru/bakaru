import Syncer from './lib/Syncer';

/**
 * Boots up Syncer
 *
 * @returns {Syncer}
 */
function bootSyncer(): Syncer {
  return new Syncer(global.bakaru.paths.library);
}

export interface LibraryInterface {
  getAll?(): Map<string, Entry>
  getOne?(entryId: string): Entry
}

export default class Library implements LibraryInterface {

}
