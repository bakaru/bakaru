import {Router} from "express"

interface CustomEventEmitter {
  on(event: string, data: any): void
}

interface ServerContext {
  events: CustomEventEmitter,
  app: Router
}

type Chapter = {
  title: string,
  time: number
};

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
};

type Subtitles = {
  id: string,
  path: string,
  title: string,
  format: string,
  embedded: boolean
};

type VoiceOver = {
  id: string,
  path: string,
  title: string,
  format: string,
  embedded: boolean
};

type Entry = {
  id: string,
  path: string,
  title: string,
  width: number,
  height: number,
  bitDepth: '8'|'10',
  episodes: Map<Episode.id, Episode>,
  subtitles: Map<Subtitles.id, Subtitles>,
  voiceOvers: Map<VoiceOver.id, VoiceOver>,
  defaultSubtitles: Subtitles.id,
  defaultVoiceOver: VoiceOver.id
};

type ClassifiedFolderItems = {
  audios: string[],
  videos: string[],
  series: string[],
  folders: string[],
  subtitles: string[]
};