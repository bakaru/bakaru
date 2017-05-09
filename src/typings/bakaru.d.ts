declare namespace Bakaru {
  export interface Chapter {
    title: string
    start: number
    end: number
  }

  export interface Episode {
    id: string
    path: string
    title: string
    watched: boolean
    chapters: Chapter[]
    stoppedAt: number
    media: ParsedMedia|null
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

  export interface EntryState {
    mediaPropsExplored: boolean
    episodesMediaPropsExplored: boolean
  }

  export interface Entry {
    id: string
    path: string
    state: EntryState
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

  export interface ParsedVideo {
    codec: string
    width: number
    height: number
    startTime: number
    bitsPerPixel: '8' | '10'
  }

  export interface ParsedAudio {
    codec: string
    channels: number
    bitRate: number
    'default': boolean
    forced: boolean
  }

  export interface ParsedSubtitle {
    language: string
    'default': boolean
    forced: boolean
  }

  export interface ParsedStreams {
    video: ParsedVideo
    audios: ParsedAudio[]
    subtitles: ParsedSubtitle[]
  }

  export interface ParsedFormat {
    duration: number
    size: number
  }

  export interface ParsedMedia {
    video: ParsedVideo
    audios: ParsedAudio[]
    chapters: Chapter[]
    subtitles: ParsedSubtitle[]
    duration: number
    size: number
  }

  export interface MediaPropsExplorerRequest {
    entryId: string
    mediaId: string
    path: string
  }

  export interface MediaPropsExplorerResponse {
    entryId: string
    mediaId: string
    media: ParsedMedia
  }
}