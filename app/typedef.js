/**
 * @typedef {{addFolder: boolean}} FlagsState
 *
 * @typedef {{folders: string[], videos: string[], subtitles: string[], audios: string[]}} ClassifiedItems
 * @typedef {{id: string, name: string, path: string: ext: string}} DubEntry
 * @typedef {{id: string, name: string, path: string: ext: string}} SubEntry
 * @typedef {{id: string, name: string, path: string: ext: string}} EpisodeEntry
 * @typedef {{scanning: boolean, episodesLoaded: boolean}} AnimeFolderState
 * @typedef {{id: string, name: string, path: string, dubs: DubEntry[], subs: SubEntry[], episodes: EpisodeEntry[], state: AnimeFolderState}} AnimeFolder
 */