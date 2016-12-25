import * as coreObjectsCreators from '../../../lib/coreObjectsCreators';
import * as path from 'path';

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
export function entry(videoPath: string): Entry {
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
export function voiceOver(audioPath: string): VoiceOver {
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
export function subtitles(subtitlesPath: string): Subtitles {
  return coreObjectsCreators.subtitles(
    filePath2folderPath(subtitlesPath),
    [subtitlesPath]
  );
}
