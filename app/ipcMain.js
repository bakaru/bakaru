import Promise from 'bluebird';
import FolderReader from 'lib/FolderReader';
import { main, renderer } from 'lib/events';

export default (app) => {
  app.ipc.on(main.minimizeMainWindow, (event, arg) => {
    app.mainWindow.minimize();
  });

  app.ipc.on(main.openSelectFolderDialog, event => {
    app.dialog.showOpenDialog(
      app.mainWindow,
      {
        properties: [
          'openDirectory',
          'multiSelections'
        ]
      },
      itemsPaths => {
        const folderReader = new FolderReader(items => event.sender.send(renderer.folderRead, items));

        itemsPaths.map(itemPath => {
          folderReader.read(itemPath);
        });
      }
    );
  });
}
