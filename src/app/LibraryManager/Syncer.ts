import * as arson from 'arson';
import * as path from 'path';
import * as fs from 'fs';

function read<T>(filename: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    fs.readFile(filename, (error, content) => {
      if (error) {
        return reject(error);
      }

      return resolve(<T>arson.parse(content.toString()));
    });
  });
}

function write(filename: string, content: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(filename, arson.stringify(content), error => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });
}

export default class FileSystem {

  public libPath: string;

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
    return read<Set<string>>(this.libPath)
      // Oops no library (fresh install) faking that its empty
      .catch(() => new Set<string>())
      // Assigning
      .then(lib => this.lib = lib);
  }

  /**
   * Syncs library file on disk
   */
  writeLib(): void {
    this.debounce(this.libDebouncer, () => write(this.libPath, this.lib));
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

    this.debounce(id, () => write(path.join(this.rootPath, `${id}.arson`), content));
  }

  /**
   * Reads ARSON file contents
   *
   * @param {string} id
   * @returns {Promise<Entry>}
   */
  read(id: string): Promise<Entry> {
    return read<Entry>(path.join(this.rootPath, `${id}.arson`));
  }
}
