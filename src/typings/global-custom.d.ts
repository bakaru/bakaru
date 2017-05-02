import events = require('events');

declare global {
  export interface CoreEvents {
    openSystemFolder: string
    folderAdded: string

    entryExplore: string
    entryExplored: string
    entryUpdate: string
    entryUpdated: string
    entryDelete: string
    entryDeleted: string
    entryStateUpdate: string
    entryStateUpdated: string

    libraryResurrected: string

    mediaPropsRequest: string
    mediaPropsResponse: string

    preferences: string

    playerSetMedia: string
    playerVolume: string
    playerMute: string
    playerPlay: string
    playerPause: string
    playerPrev: string
    playerNext: string
    playerSeek: string
    playerAudioOffset: string

    errors: {
      folderNotFolder: string // Yo dawg
      folderNotExist: string
    }
  }

  export interface Events extends events.EventEmitter {
    core: CoreEvents
  }
}
