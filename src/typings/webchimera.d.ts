import EventEmitter = NodeJS.EventEmitter

declare namespace WebChimera {
  export interface RV32VideoFrame {
    width: number,
    height: number,
    pixelFormat: 'RV32'
  }

  export interface I420VideoFrame {
    width: number,
    height: number,
    pixelFormat: 'I420',
    uOffset: number,
    vOffset: number
  }

  export type VideoFrame = RV32VideoFrame&I420VideoFrame&{
    subarray: (uOffset: number, vOffset: number) => number[],
    length: number
  };

  export interface VlcInput {

  }

  export interface VlcAudio {
    track: number
  }

  export interface VlcVideo {

  }

  export interface VlcSubtitles {

  }

  export interface VlcDeinterlace {

  }

  export interface VlcPlaylist {
    clear: () => void,
    add: (mrl: string) => void
  }

  export interface VlcPlaylistItems {

  }

  export interface VlcMedia {

  }

  export enum VlcPlayerState {
    NothingSpecial,
    Opening,
    Buffering,
    Playing,
    Paused,
    Stopped,
    Ended,
    Error
  }

  export interface VlcPlayer {
    readonly vlcVersion: string,
    readonly vlcChangeset: string,
    readonly playing: boolean,
    readonly length: number,
    readonly state: VlcPlayerState,
    readonly videoFrame: VideoFrame,
    readonly events: EventEmitter,

    pixelFormat: 'RV32' | 'I420',
    position: number,
    time: number,
    volume: number,
    mute: boolean,

    input: VlcInput,
    audio: VlcAudio,
    video: VlcVideo,
    subtitles: VlcSubtitles,
    playlist: VlcPlaylist,

    play: (mrl?: string) => void,
    pause: () => void,
    togglePause: () => void,
    stop: () => void,
    toggleMute: () => void,
    close: () => void,

    onFrameSetup: (width: number, height: number, pixelFormat: 'RV32' | 'I420', videoFrame: VideoFrame) => void,
    onFrameReady: (videoFrame: VideoFrame) => void,
    onFrameCleanUp: () => void,
    onMediaChanged: () => void,
    onNothingSpecial: () => void,
    onOpening: () => void,
    onBuffering: (percents: number) => void,
    onPlaying: () => void,
    onPaused: () => void,
    onForward: () => void,
    onBackward: () => void,
    onEncounteredError: (error?: any) => void,
    onEndReached: () => void,
    onStopped: () => void,
    onTimeChanged: (time: number) => void,
    onPositionChanged: (position: number) => void,
    onSeekableChanged: (seekable: boolean) => void,
    onPausableChanged: (pausable: boolean) => void,
    onLengthChanged: (length: number) => void,
    onLogMessage: (level: string, message: string, format: string) => void
  }

  export interface WebChimera {
    createPlayer: () => VlcPlayer
  }
}

export = WebChimera;
