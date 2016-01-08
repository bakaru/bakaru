import Promise from 'bluebird';

import { main, renderer } from 'lib/events';

export default (app) => {
  app.ipc.on(main.minimizeMainWindow, (event, arg) => {
    app.mainWindow.minimize();
  });

  app.ipc.on(main.openSelectFolderDialog, event => {
    const selected = new Promise((resolve, reject) => {
      app.dialog.showOpenDialog(
        app.mainWindow,
        {
          properties: [
            'openDirectory',
            'multiSelections'
          ]
        },
        items => {
          resolve(items);
        }
      );
    });

    selected.then(items => {
      event.sender.send(renderer.folderRead, items);
    });
  });
}
