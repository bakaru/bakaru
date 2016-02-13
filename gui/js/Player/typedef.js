/**
 * @typedef {{
 *  vlcVersion: string,
 *  vlcChangeset: string,
 *  playing: boolean,
 *  length: number,
 *  state: number,
 *  videoFrame: Uint8Array,
 *  events: EventEmitter,
 *
 *  pixelFormat: string,
 *  position: float,
 *  time: int,
 *  volume: int,
 *  mute: boolean,
 *
 *  input: VlcInput,
 *  audio: VlcAudio,
 *  video: VlcVideo,
 *  subtitles: VlcSubtitles,
 *  playlist: VlcPlaylist
 * }} VlcPlayer
 */
/**
 * @name VlcPlayer#play
 * @param {string=} mrl
 */
function VlcPlayer_play(mrl = '') {}
/**
 * @name VlcPlayer#plause
 */
function VlcPlayer_pause() {}
/**
 * @name VlcPlayer#togglePause
 */
function VlcPlayer_togglePause() {}
/**
 * @name VlcPlayer#stop
 */
function VlcPlayer_stop() {}
/**
 * @name VlcPlayer#toggleMute
 */
function VlcPlayer_toggleMute() {}
/**
 * @name VlcPlayer#close
 */
function VlcPlayer_close() {}

/**
 * @typedef {{}} VlcPlaylist
 * @typedef {{}} VlcSubtitles
 * @typedef {{}} VlcDeinterlace
 * @typedef {{}} VlcAudio
 * @typedef {{}} VlcVideo
 * @typedef {{}} VlcInput
 * @typedef {{}} VlcPlaylistItems
 * @typedef {{}} VlcMedia
 */