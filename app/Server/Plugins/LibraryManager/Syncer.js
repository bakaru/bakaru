const bluebird = require('bluebird');
const arson = require('arson');
const path = require('path');
const {
  readFileAsync: read,
  writeFileAsync: write
} = bluebird.promisifyAll(require('fs'));

class Syncer {

  /**
   * Ctor
   *
   * @param {string} rootPath a path to folder where all cache will live
   */
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.libPath = path.join(rootPath, 'library.arson');

    this.lib = new Set();
    this.libDebouncer = 'index';
    this.debouncers = new Map();
  }

  /**
   * Debounce functions executions
   *
   * @param {string} id
   * @param {function} func
   * @param {number} delay
   */
  debounce(id, func, delay = 200) {
    if (this.debouncers.has(id)) {
      clearTimeout(this.debouncers.get(id));
    }

    this.debouncers.set(id, setTimeout(func, delay));
  }

  /**
   * Resurrects library
   *
   * @returns {Promise<Set<string>>}
   */
  resurrect() {
    return read(this.libPath)
      .then(arson.parse)
      .then(lib => this.lib = lib);
  }

  /**
   * Syncs library file on disk
   */
  writeLib() {
    this.debounce(this.libDebouncer, () => write(this.libPath, arson.stringify(this.lib)));
  }

  /**
   * Writes entry
   *
   * @param {string} id
   * @param {Entry} content
   */
  write(id, content) {
    if (!this.lib.has(id)) {
      this.lib.add(id);
      this.writeLib();
    }

    this.debounce(id, () => write(path.join(this.rootPath, `${id}.arson`), arson.stringify(content)));
  }

  /**
   * Reads ARSON file contents
   *
   * @param {string} id
   * @returns {Promise<Entry>}
   */
  read(id) {
    return read(path.join(this.rootPath, `${id}.arson`)).then(arson.parse);
  }
}

module.exports = Syncer;
