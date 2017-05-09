const sha224 = require('js-sha256').sha224;
import * as p from 'path';

/**
 * Normalizes entry title as possible
 *
 * @param {string} title
 * @returns {string}
 */
function basename2title(title: string): string {
  let name = title;

  // Get rid of [720p] and similar shit
  name = name.replace(/(\[.*?])/g, '');
  // Get rid of (720p) and similar shit
  name = name.replace(/(\(.*?\))/g, '');
  // Replace _. with space
  name = name.replace(/[_\.]/g, ' ');

  return name.trim();
}

/**
 * Returns normalized extension name
 *
 * @param {string} path
 * @returns {string}
 */
function extname(path: string): string {
  return p.extname(path).slice(1).toLowerCase();
}

/**
 * Converts items to map of itemId=>itemPath
 *
 * @param {string[]} items
 * @return {Map<string, string>}
 */
function items2map(items: string[]): Map<string, string> {
  const map = new Map<string, string>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemBasename = p.basename(item, p.extname(item));

    map.set(sha224(itemBasename), item);
  }

  return map;
}

export function entryState(): Bakaru.EntryState {
  return {
    mediaPropsExplored: false,
    episodesMediaPropsExplored: false,
  } as Bakaru.EntryState;
}

/**
 * Makes new entry object
 *
 * @param {string} path
 * @return {Bakaru.Entry}
 */
export function entry(path: string): Bakaru.Entry {
  const basename = p.basename(path);

  return {
    id: sha224(path),
    path,
    state: entryState(),
    title: basename2title(basename),
    width: 0,
    height: 0,
    bitDepth: '8',
    episodes: new Map(),
    subtitles: new Map(),
    voiceOvers: new Map(),
    defaultSubtitles: '',
    defaultVoiceOver: ''
  };
}

/**
 * Makes new episode object
 *
 * @param {string} path
 * @return {Bakaru.Episode}
 */
export function episode(path: string): Bakaru.Episode {
  const extension = p.extname(path);
  const format = extension.slice(1).toLowerCase();
  const basename = p.basename(path, extension);

  return {
    id: sha224(basename),
    path,
    title: basename2title(basename),
    watched: false,
    chapters: [],
    stoppedAt: 0,
    media: null
  };
}

/**
 * Makes new chapter object
 *
 * @param {string} title
 * @param {number} start
 * @param {number} end
 * @return {Bakaru.Chapter}
 */
export function chapter(title: string, start: number, end: number): Bakaru.Chapter {
  return {
    end,
    start,
    title
  };
}

/**
 * Makes new subtitles object
 *
 * @param {string} path
 * @param {string[]} items
 * @param {boolean} embedded
 * @return {Bakaru.Subtitles}
 */
export function subtitles(path: string, items: string[], embedded: boolean = false): Bakaru.Subtitles {
  const basename = p.basename(path);

  return {
    id: sha224(basename),
    path,
    items: items2map(items),
    title: basename2title(basename),
    format: extname(items[0]),
    embedded
  };
}

/**
 * Makes new voiceOver object
 *
 * @param {string} path
 * @param {string[]} items
 * @param {boolean} embedded
 * @return {Bakaru.VoiceOver}
 */
export function voiceOver(path: string, items: string[], embedded: boolean = false): Bakaru.VoiceOver {
  const basename = p.basename(path);

  return {
    id: sha224(basename),
    path,
    items: items2map(items),
    title: basename2title(basename),
    format: extname(items[0]),
    embedded
  };
}
