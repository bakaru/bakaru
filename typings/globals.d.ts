///<reference types="node"/>
///<reference types="react"/>
///<reference types="express"/>
///<reference types="bluebird"/>
///<reference types="electron"/>

import { Router } from 'express';
import './fastpriorityqueue';

declare global {
  type ElectronAll = Electron.ElectronMainAndRenderer

  interface CustomEventEmitter {
    on(event: string, data: any): void
  }

  interface ServerContext {
    events: CustomEventEmitter,
    app: Router
  }

  type Chapter = {
    title: string
    start: number
    end: number
  }

  type Episode = {
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

  type Subtitles = {
    id: string,
    path: string,
    title: string,
    format: string,
    embedded: boolean
  }

  type VoiceOver = {
    id: string,
    path: string,
    title: string,
    format: string,
    embedded: boolean
  }

  type Entry = {
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

  type ClassifiedFolderItems = {
    audios: string[],
    videos: string[],
    series: string[],
    folders: string[],
    subtitles: string[]
  }

  type MediaProperties = {
    width: number
    height: number
    bitDepth: number,
    codec: string
    chapters: Chapter[]
    subtitles: string[]
    voiceOvers: string[]
  }
}
