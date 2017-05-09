import { Plugin } from '../PluginManager'
import { ServerContext } from "../server"
import { Event } from '../Events'
import FS from '../lib/FS'

export default class LibraryManager implements Plugin {
  protected fs: FS;

  getId(): string {
    return 'library-manager';
  }

  constructor(protected context: ServerContext) {
    this.fs = new FS(global.bakaru.paths.library);

    this.fs.resurrect().then(async (entriesIds: Set<string>) => {
      for (const entryId of entriesIds) {
        const entry = await this.fs.read(entryId).catch(() => null);

        if (entry !== null) {
          this.context.library.set(
            entryId,
            entry
          );
        }
      }

      this.context.events.emit(
        Event.LibraryResurrected,
        this.context.library
      );
    });

    this.context.events.on(
      Event.EntryExplore,
      this.onEntryExplore.bind(this)
    );
    this.context.events.on(
      Event.EntryUpdate,
      this.onEntryUpdate.bind(this)
    );
    this.context.events.on(
      Event.EntryStateUpdate,
      this.onEntryStateUpdate.bind(this)
    );

    this.context.events.on(
      Event.MediaPropsResponse,
      this.onMediaPropsResponse.bind(this)
    );
  }

  protected onMediaPropsResponse(response: Bakaru.MediaPropsExplorerResponse) {
    const entry = this.context.library.get(response.entryId);
    const episode = entry.episodes.get(response.mediaId);

    entry.bitDepth = response.media.video.bitsPerPixel;
    entry.width = response.media.video.width;
    entry.height = response.media.video.height;
    entry.state.mediaPropsExplored = true;

    episode.media = response.media;

    this.onEntryUpdate(entry);
  }

  protected onEntryExplore(entry: Bakaru.Entry) {
    this.context.library.set(entry.id, entry);
    this.fs.write(entry);
    this.emitExplored(entry);

    this.processEpisodes(entry);
  }

  protected processEpisodes(entry: Bakaru.Entry): void {
    const episodes = [...entry.episodes.values()];

    episodes.forEach((episode, index) => {
      const priority = index === 0
        ? 2 // High priority
        : 1; // Low priority

      this.context.events.emit(
        Event.MediaPropsRequest,
        {
          entryId: entry.id,
          mediaId: episode.id,
          path: episode.path
        },
        priority
      );
    });
  }

  protected onEntryUpdate(entry: Bakaru.Entry) {
    if (this.context.library.has(entry.id)) {
      this.context.library.set(entry.id, entry);
      this.fs.write(entry);
      this.emitUpdated(entry);
    }
  }

  protected onEntryStateUpdate(id: string, state: Bakaru.EntryState) {
    const entry = this.context.library.get(id);

    if (entry) {
      entry.state = state;

      this.context.library.set(id, entry);
      this.fs.write(entry);
      this.emitStateUpdated(id, state);
    }
  }

  protected emitExplored(entry: Bakaru.Entry) {
    this.context.events.emit(
      Event.EntryExplored,
      entry
    );
  }

  protected emitUpdated(entry: Bakaru.Entry) {
    this.context.events.emit(
      Event.EntryUpdated,
      entry
    );
  }

  protected emitStateUpdated(id: string, state: Bakaru.EntryState) {
    this.context.events.emit(
      Event.EntryExplored,
      { id, state }
    );
  }
}
