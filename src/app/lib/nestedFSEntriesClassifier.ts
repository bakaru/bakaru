import * as bluebird from 'bluebird';
import * as path from 'path';
import { readdir } from 'fs';
import classifyFSEntries from './classifyFSEntries';

const read = bluebird.promisify(readdir);

/**
 * Transforms all items to absolute paths to those items
 *
 * @param {string} folderPath
 * @param {string[]} items
 * @returns {string[]}
 */
function normalizeItems(folderPath: string, items: string[]): string[] {
  return items.map(item => path.join(folderPath, item));
}

/**
 * Reads folder
 *
 * @param {string} folderPath
 * @returns {Promise<ClassifiedFolderItems>}
 */
async function readFolder(folderPath: string): Promise<ClassifiedFolderItems> {
  const items = await read(folderPath);

  return await classifyFSEntries(normalizeItems(folderPath, items));
}

/**
 * Builds flat tree of classified sub folders structure
 *
 * @param {string} folderPath
 * @returns {Promise<Map<string, ClassifiedFolderItems>>}
 */
export default async function flatten(folderPath: string): Promise<Map<string, ClassifiedFolderItems>> {
  const flatTree = new Map<string, ClassifiedFolderItems>();
  const unreadFolders = new Set<string>([folderPath]);
  const addUnreadFolder = unreadFolders.add.bind(unreadFolders);

  while (unreadFolders.size > 0) {
    for (const subFolderPath of unreadFolders.values()) {
      unreadFolders.delete(subFolderPath);

      const classes = yield readFolder(subFolderPath);

      if (classes.folders.length > 0) {
        classes.folders.map(addUnreadFolder);
        classes.folders.length = 0;
      }

      if ((classes.audios.length + classes.videos.length + classes.subtitles.length) > 0) {
        flatTree.set(subFolderPath, classes);
      }
    }
  }

  return flatTree;
}