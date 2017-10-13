import evts = require('events');

export default class EventEmitter {
  protected ee: any;

  constructor() {
    this.ee = new evts.EventEmitter();
  }

  on(event: Event, cb: Function) {
    this.ee.on(event, cb);
  }

  emit(event: Event, ...payload: any[]) {
    this.ee.emit(event, ...payload);
  }
}

export enum Event {
  OpenSystemFolder,
  FolderAdded,
  EntryUpdate,
  EntryUpdated,
  EntryExplore,
  EntryExplored,
  EntryDelete,
  EntryDeleted,
  EntryStateUpdate,
  EntryStateUpdated,
  EntryEpisodeWatched,
  EntryEpisodeStoppedAt,

  LibraryResurrected,

  MediaPropsRequest,
  MediaPropsResponse,

  LibraryRequest,
  LibraryResponse,

  Preferences,

  PlayerSetMedia,
  PlayerVolume,
  PlayerMute,
  PlayerPlay,
  PlayerPause,
  PlayerPrev,
  PlayerNext,
  PlayerSeek,
  PlayerAudioOffset,

  ErrorFolderNotFolder,
  ErrorFolderNotExist,

  UpdateCheck,
  UpdateCheckPending,
  UpdateAvailable,
  UpdateNotAvailable,
  UpdateDownloading,
  UpdateDownloaded,
  UpdatePerform
}
