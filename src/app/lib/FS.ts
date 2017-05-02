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
  public lib = new Set<string>();

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
   * @param {Bakaru.Entry} entry
   */
  write(entry: Bakaru.Entry): void {
    if (!this.lib.has(entry.id)) {
      this.lib.add(entry.id);
      this.writeLib();
    }

    this.debounce(entry.id, () => write(path.join(this.rootPath, `${entry.id}.arson`), entry));
  }

  /**
   * Reads ARSON file contents
   *
   * @param {string} id
   * @returns {Promise<Bakaru.Entry>}
   */
  read(id: string): Promise<Bakaru.Entry> {
    return read<Bakaru.Entry>(path.join(this.rootPath, `${id}.arson`));
  }
}
