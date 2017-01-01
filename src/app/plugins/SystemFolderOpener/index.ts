import { dialog } from 'electron';
import { ServerContext } from '../../server';
import { Plugin } from '../../PluginManager';

export default class SystemFolderOpener implements Plugin {
  getId(): string {
    return 'system-folder-opener';
  }

  constructor(protected context: ServerContext) {
    this.context.events.on(
      this.context.events.coreEvents.openSystemFolder,
      this.onOpenSystemFolder.bind(this)
    );
  }

  onOpenSystemFolder() {
    dialog.showOpenDialog(
      this.context.window.mainWindow,
      {
        properties: [ 'openDirectory', 'multiSelections' ]
      },
      itemsPaths => {
        if (itemsPaths) {
          itemsPaths.forEach(
            itemPath => this.context.events.emit(this.context.events.coreEvents.folderAdded, itemPath)
          );
        }
      }
    );
  }
}
