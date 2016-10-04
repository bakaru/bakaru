const coreObjectsCreators = require('../../coreObjectsCreators');
const path = require('path');

/**
 * Converts file path to fake folder path by removing extension
 *
 * @param {string} filePath
 * @returns {string}
 */
function filePath2folderPath(filePath) {
  return filePath.slice(0, filePath.length - path.extname(filePath).length);
}

/**
 * Makes standalone entry
 *
 * @param {string} videoPath
 * @returns {Entry}
 */
function entry(videoPath) {
  const entryPath = filePath2folderPath(videoPath);

  const entry = coreObjectsCreators.entry(entryPath);
  const episode = coreObjectsCreators.episode(videoPath);

  entry.episodes.set(episode.id, episode);

  return entry;
}

/**
 * Makes standalone voice-over
 *
 * @param {string} audioPath
 * @returns {VoiceOver}
 */
function voiceOver(audioPath) {
  return coreObjectsCreators.voiceOver(
    filePath2folderPath(audioPath),
    [audioPath]
  );
}

/**
 * Makes standalone subtitles
 *
 * @param {string} subtitlesPath
 * @returns {Subtitles}
 */
function subtitles(subtitlesPath) {
  return coreObjectsCreators.subtitles(
    filePath2folderPath(subtitlesPath),
    [subtitlesPath]
  );
}

module.exports = {
  entry,
  voiceOver,
  subtitles
};
