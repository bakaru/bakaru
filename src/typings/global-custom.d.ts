import { WebChimera as WebChimeraInterface } from './webchimera';
// WTF TS?!
// Without this it will lose all the declarations...
import 'express';

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
