import { WebChimera as WebChimeraInterface } from './webchimera';
import events = require('events');

declare global {
  export const WebChimera: WebChimeraInterface;

  export interface WebGLTexture {
    constructor(gl: WebGLRenderingContext): void
    fill(width: number, height: number, data: number[]): void
  }

  export interface WebGLRenderingContext {
    y: WebGLTexture,
    u: WebGLTexture,
    v: WebGLTexture
  }

  export interface ThemeInterface {
    mainBgColor: string
    mainFgColor: string
    mainBorderColor: string
    contrastColor: string
    highlightColor: string

    clr0: string
    clr1: string
    clr2: string
    clr3: string
    clr4: string
    clr5: string
    clr6: string
    clr7: string
    clr8: string
    clr9: string

    libraryListWidth: string
    libraryDetailsWidth: string
  }

  export interface StyledProps {
    theme: ThemeInterface
  }

  export interface Chapter {
    title: string
    start: number
    end: number
  }

  export interface Episode {
    id: string
    path: string
    title: string
    format: string
    codec: string
    watched: boolean
    chapters: Chapter[]
    duration: number
    stoppedAt: number
  }

  export interface Subtitles {
    id: string
    path: string
    items: Map<string, string>
    title: string
    format: string
    embedded: boolean
  }

  export interface VoiceOver {
    id: string
    path: string
    items: Map<string, string>
    title: string
    format: string
    embedded: boolean
  }

  export interface Entry {
    id: string
    path: string
    title: string
    width: number
    height: number
    bitDepth: '8'|'10'
    episodes: Map<string, Episode>
    subtitles: Map<string, Subtitles>
    voiceOvers: Map<string, VoiceOver>
    defaultSubtitles: string
    defaultVoiceOver: string
  }

  export interface ClassifiedFolderItems {
    audios: string[]
    videos: string[]
    series: string[]
    folders: string[]
    subtitles: string[]
  }

  export interface MediaProperties {
    width: number
    height: number
    bitDepth: number
    codec: string
    chapters: Chapter[]
    subtitles: string[]
    voiceOvers: string[]
  }

  export interface CoreEvents {
    openSystemFolder: string
    folderAdded: string

    entryUpdate: string

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
    coreEvents: CoreEvents
  }
}
