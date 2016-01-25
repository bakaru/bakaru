/**
 * @typedef {{addFolder: boolean}} FlagsState
 *
 * @typedef {{folders: string[], videos: string[], subtitles: string[], audios: string[]}} ClassifiedItems
 * @typedef {{id: string, name: string, path: string, filename: string, ext: string}} DubEntry
 * @typedef {{id: string, name: string, path: string, filename: string, ext: string}} SubEntry
 * @typedef {{id: string, name: string, path: string, filename: string, ext: string}} BonusEntry
 * @typedef {{id: string, name: string, path: string, filename: string, ext: string, mediainfo: {}}} EpisodeEntry
 * @typedef {{scanning: boolean, subScanning: boolean, mediainfoScanning: boolean}} AnimeFolderState
 * @typedef {{dub: DubEntry.id|boolean, sub: SubEntry.id|boolean}} AnimeSelections
 * @typedef {{id: string, name: string, path: string, quality: string, selections: AnimeSelections, dubs: DubEntry[], subs: SubEntry[] bonuses: BonusEntry[], episodes: EpisodeEntry[], state: AnimeFolderState}} AnimeFolder
 */