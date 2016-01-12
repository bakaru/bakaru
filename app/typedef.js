/**
 * @typedef {{addFolder: boolean}} FlagsState
 *
 * @typedef {{folders: string[], videos: string[], subtitles: string[], audios: string[]}} ClassifiedItems
 * @typedef {{id: string, name: string, path: string, filename: string, ext: string}} DubEntry
 * @typedef {{id: string, name: string, path: string, filename: string, ext: string}} SubEntry
 * @typedef {{id: string, name: string, path: string, filename: string, ext: string}} BonusEntry
 * @typedef {{id: string, name: string, path: string, filename: string, ext: string}} EpisodeEntry
 * @typedef {{scanning: boolean}} AnimeFolderState
 * @typedef {{id: string, name: string, path: string, dubs: DubEntry[], subs: SubEntry[] bonuses: BonusEntry[], episodeInfo: {}, episodes: EpisodeEntry[], state: AnimeFolderState}} AnimeFolder
 */