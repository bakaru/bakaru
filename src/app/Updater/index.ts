import { ServerContext } from '../server'
import { Event } from '../Events'
import { Plugin } from '../PluginManager'
import { autoUpdater } from 'electron-updater'
import * as debug from 'debug'

export default class Updater implements Plugin {
  getId(): string {
    return 'updater';
  }

  constructor(protected context: ServerContext) {
    autoUpdater.on('checking-for-update', () => context.events.emit(Event.UpdateCheckPending));
    autoUpdater.on('update-available', () => context.events.emit(Event.UpdateAvailable));
    autoUpdater.on('update-not-available', () => context.events.emit(Event.UpdateNotAvailable));
    autoUpdater.on('download-progress', () => context.events.emit(Event.UpdateDownloading));
    autoUpdater.on('update-downloaded', () => context.events.emit(Event.UpdateDownloaded));

    autoUpdater.checkForUpdatesAndNotify();

    context.events.on(Event.UpdateCheck, () => {
      if (global.bakaru.debug) {
        console.log('Kek update');

        context.events.emit(Event.UpdateCheckPending);

        setTimeout(() => context.events.emit(Event.UpdateAvailable), 1000);
      } else {
        autoUpdater.checkForUpdates();
      }
    });
    context.events.on(Event.UpdatePerform, () => autoUpdater.quitAndInstall());
  }
}
