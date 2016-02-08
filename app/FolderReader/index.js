'use strict';

const FolderReaderBase = require('./FolderReaderBase');

/**
 * @param {App} app
 * @returns {FolderReaderBase}
 */
function createFolderReader (app) {
  /**
   * @type {FolderReaderBase}
   */
  const folderReader = new FolderReaderBase(app);

  app.ipc.on(app.events.main.openSelectFolderDialog, event => {
    event.sender.send(app.events.renderer.flagAddAnimeFolderStart);

    app.dialog.showOpenDialog(
      app.mainWindow,
      {
        properties: [
          'openDirectory',
          'multiSelections'
        ]
      },
      itemsPaths => {
        if (itemsPaths) {
          folderReader.setHandlers(
            animeFolder => event.sender.send(app.events.renderer.addAnimeFolder, animeFolder),
            animeFolder => event.sender.send(app.events.renderer.updateAnimeFolder, animeFolder)
          );

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
