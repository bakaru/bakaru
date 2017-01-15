import {  EventEmitter } from 'events';

export default class Events extends EventEmitter implements Events {
  public core: CoreEvents = {
    openSystemFolder: 'core:openSystemFolder',
    folderAdded: 'core:folderAdded',

    entryUpdate: 'core:entryUpdate',
    entryUpdated: 'core:entryUpdated',
    entryExplore: 'core:entryExplore',
    entryExplored: 'core:entryExplored',
    entryDelete: 'core:entryDelete',
    entryDeleted: 'core:entryDeleted',
    entryStateUpdate: 'core:entryStateUpdate',
    entryStateUpdated: 'core:entryStateUpdated',

    libraryResurrected: 'core:libraryResurrected',

    mediaPropsRequest: 'core:mediaPropsRequest',
    mediaPropsResponse: 'core:mediaPropsResponse',

    preferences: 'core:preferences',

    playerSetMedia: 'core:playerSetMedia',
    playerVolume: 'core:playerVolume',
    playerMute: 'core:playerMute',
    playerPlay: 'core:playerPlay',
    playerPause: 'core:playerPause',
    playerPrev: 'core:playerPrev',
    playerNext: 'core:playerNext',
    playerSeek: 'core:playerSeek',
    playerAudioOffset: 'core:playerAudioOffset',

    errors: {
      folderNotFolder: 'core:errors:folderNotFolder',
      folderNotExist: 'core:errors:folderNotExist',
    }
  };
}
