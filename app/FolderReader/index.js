'use strict';

const FolderReader = require('./FolderReader');

/**
 * @param {App} app
 * @returns {FolderReader}
 */
function createFolderReader (app) {
  /**
   * @type {FolderReader}
   */
  const folderReader = new FolderReader(app);

  app.ipc.on(app.events.main.openSelectFolderDialog, event => {
    event.sender.send(app.events.renderer.flagAddAnimeFolderStart);

    app.dialog.showOpenDialog(
      app.mainWindow,
      { properties: [ 'openDirectory', 'multiSelections' ] },
      itemsPaths => {
        if (itemsPaths) {
          folderReader.setSender((e, payload) => event.sender.send(e, payload));

          itemsPaths.map(itemPath => {
            folderReader.findAnime(itemPath)
              .catch(err => {
                app.dialog.showErrorBox('No anime found :c', `${err}`);
              })
              .finally(() => {
                event.sender.send(app.events.renderer.flagAddAnimeFolderEnd);
              });
          });
        } else {
          event.sender.send(app.events.renderer.flagAddAnimeFolderEnd);
        }
      }
    );
  });

  return folderReader;
}

module.exports = createFolderReader;
