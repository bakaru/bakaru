import { Router } from 'express';

declare global {
  export interface CustomEventEmitter {
    on(event: string, data: any): void
  }

  export interface ServerContext {
    events: CustomEventEmitter,
    app: Router
  }

  export type Chapter = {
    title: string
    start: number
    end: number
  }

  export type Episode = {
    id: string,
    path: string,
    title: string,
    format: string,
    codec: string,
    watched: boolean,
    chapters: Chapter[],
    duration: number,
    stoppedAt: number
  }

  export type Subtitles = {
    id: string,
    path: string,
    title: string,
    format: string,
    embedded: boolean
  }

  export type VoiceOver = {
    id: string,
    path: string,
    title: string,
    format: string,
    embedded: boolean
  }

  export type Entry = {
    id: string,
    path: string,
    title: string,
    width: number,
    height: number,
    bitDepth: '8'|'10',
    episodes: Map<string, Episode>,
    subtitles: Map<string, Subtitles>,
    voiceOvers: Map<string, VoiceOver>,
    defaultSubtitles: string,
    defaultVoiceOver: string
  }

  export type ClassifiedFolderItems = {
    audios: string[],
    videos: string[],
    series: string[],
    folders: string[],
    subtitles: string[]
  }

  export type MediaProperties = {
    width: number
    height: number
    bitDepth: number,
    codec: string
    chapters: Chapter[]
    subtitles: string[]
    voiceOvers: string[]
  }
}
