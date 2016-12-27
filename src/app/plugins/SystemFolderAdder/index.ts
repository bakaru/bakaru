import events from '../../coreEvents';
import { dialog } from 'electron';
import { ServerContext } from '../../server';
import { Plugin } from '../../PluginManager';

export default class SystemFolderAdder implements Plugin {
  getId(): string {
    return 'system-folder-adder';
  }

  constructor(protected context: ServerContext) {
    this.context.events.on(events.openSystemFolder, this.onOpenSystemFolder.bind(this));
  }

  onOpenSystemFolder() {
    dialog.showOpenDialog(
      this.context.window.mainWindow,
      {
        properties: [ 'openDirectory', 'multiSelections' ]
      },
      itemsPaths => {
        if (itemsPaths) {
          itemsPaths.forEach(itemPath => this.context.events.emit(events.folderAdded, itemPath));
        }
      }
    );
  }
}
