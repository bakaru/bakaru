const bluebird = require('bluebird');
const path = require('path');
const { readdirAsync: read } = bluebird.promisifyAll(require('fs'));

const classify = require('./classify');

/**
 * Transforms all items to absolute paths to those items
 *
 * @param {string} folderPath
 * @param {string[]} items
 * @returns {string[]}
 */
function normalizeItems(folderPath, items) {
  return items.map(item => path.join(folderPath, item));
}

/**
 * Reads folder
 *
 * @param {string} folderPath
 * @returns {Promise<ClassifiedFolderItems>}
 */
function readFolder(folderPath) {
  return read(folderPath)
    .then(items => normalizeItems(folderPath, items))
    .then(classify);
}

/**
 * Builds flat tree of classified sub folders structure
 *
 * @param {string} folderPath
 * @returns {Promise<Map<string, ClassifiedFolderItems>>}
 */
function flatten(folderPath) {
  return bluebird.coroutine(function *() {
    const flatTree = new Map();
    const unreadFolders = new Set([folderPath]);
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
  })();
};

module.exports = flatten;
