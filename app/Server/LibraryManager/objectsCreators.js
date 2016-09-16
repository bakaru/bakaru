/**
 * Makes new entry object
 *
 * @param {string} id
 * @param {string} path
 * @return {Entry}
 */
function entry(id, path) {
  return {
                      id,
                      path,
    title:            '',
    width:            0,
    height:           0,
    bitDepth:         8,
    episodes:         new Map(),
    subtitles:        new Map(),
    voiceOvers:       new Map(),
    defaultSubtitles: '',
    defaultVoiceOver: ''
  };
}

/**
 * Makes new episode object
 *
 * @param {string} id
 * @param {string} path
 * @return {Episode}
 */
function episode(id, path) {
  return {
               id,
               path,
    title:     '',
    format:    'mkv',
    codec:     'x264',
    watched:   false,
    chapters:  [],
    duration:  0,
    stoppedAt: 0
  };
}

/**
 * Makes new chapter object
 *
 * @param {string} title
 * @param {number} time
 * @return {Chapter}
 */
function chapter(title, time) {
  return {
    time,
    title
  }
}

/**
 * Makes new subtitles object
 *
 * @param {string} id
 * @param {string} path
 * @return {Subtitles}
 */
function subtitles(id, path) {
  return {
            id,
            path,
    title:  '',
    format: 'ass'
  };
}

/**
 * Makes new voiceOver object
 *
 * @param {string} id
 * @param {string} path
 * @return {VoiceOver}
 */
function voiceOver(id, path) {
  return {
            id,
            path,
    title:  '',
    format: 'mpa'
  };
}

module.exports = {
  entry,
  episode,
  chapter,
  voiceOver,
  subtitles
};
