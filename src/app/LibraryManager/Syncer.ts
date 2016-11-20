import * as arson from 'arson';
import * as path from 'path';
import * as fs from 'fs';

function read(filename: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(filename, (error, content) => {
      if (error) {
        return reject(error);
      }

      return resolve(content.toString());
    });
  });
}

function write(filename: string, content: string): Promise<void> {
  return new Promise<string>((resolve, reject) => {
    fs.writeFile(filename, content, error => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });
}

export default class FileSystem {

  protected libPath: string;
  protected lib = new Set<string>();
  protected libDebouncer = 'index';
  protected debouncers = new Map<string, number>();

  /**
   * Ctor
   *
   * @param {string} rootPath a path to folder where all cache will live
   */
  constructor(protected rootPath: string) {
    this.libPath = path.join(rootPath, 'library.arson');
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
  resurrect(): Promise<Set<string>> {
    // Reading library file
    return read(this.libPath)
      // Parsing library from ARSON
      .then(value => arson.parse<Set<string>>(value))
      // Oops no library (fresh install) faking that its empty
      .catch(() => new Set<string>())
      // Assigning
      .then(lib => this.lib = lib);
  }

  /**
   * Syncs library file on disk
   */
  writeLib(): void {
    this.debounce(this.libDebouncer, () => write(this.libPath, arson.stringify(this.lib)));
  }

  /**
   * Writes entry
   *
   * @param {string} id
   * @param {Entry} content
   */
  write(id: string, content: Entry): void {
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
  read(id: string): Promise<Entry> {
    return read(path.join(this.rootPath, `${id}.arson`)).then(arson.parse);
  }
}
