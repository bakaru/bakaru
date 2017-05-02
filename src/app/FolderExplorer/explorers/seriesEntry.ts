import classifyNestedFSEntries from '../nestedFSEntriesClassifier';
import * as make from '../../lib/coreObjectsCreators';
import extractSameParts from '../stringSamePartsExtractor';

/**
 * Fills entry with episodes
 *
 * @param {Bakaru.Entry} entry
 * @param {string[]} episodesPaths
 */
function makeSeriesEntryEpisodes(entry: Bakaru.Entry, episodesPaths: string[]): void {
  const episodesTitles = [];

  for (let index = 0; index < episodesPaths.length; index++) {
    const episode = make.episode(episodesPaths[index]);

    entry.episodes.set(episode.id, episode);
    episodesTitles.push(episode.title);
  }

  // Removing same parts from episodes names
  const [sameStart, sameEnd] = extractSameParts(episodesTitles);

  if (sameStart.length === 0 && sameEnd.length === 0) {
    return;
  }

  for (const episode of entry.episodes.values()) {
    episode.title = episode.title
      .replace(sameStart, '')
      .replace(sameEnd, '');
  }
}

/**
 * Fills entry with voice-overs
 *
 * @param {Bakaru.Entry} entry
 * @param {Map<string, string[]>} voiceOvers
 */
function makeSeriesVoiceOvers(entry: Bakaru.Entry, voiceOvers: Map<string, string[]>): void {
  for (const [voiceOverPath, voiceOverItems] of voiceOvers.entries()) {
    const voiceOver = make.voiceOver(voiceOverPath, voiceOverItems);

    entry.voiceOvers.set(voiceOver.id, voiceOver);
  }
}

/**
 * Fills entry with subtitles
 *
 * @param {Bakaru.Entry} entry
 * @param {Map<string, string[]>} subtitles
 */
function makeSeriesSubtitles(entry: Bakaru.Entry, subtitles: Map<string, string[]>): void {
  for (const [subtitlePath, subtitleItems] of subtitles.entries()) {
    const subtitle = make.subtitles(subtitlePath, subtitleItems);

    entry.subtitles.set(subtitle.id, subtitle);
  }
}

/**
 * Expands series folder
 *
 * @param {string} seriesPath
 * @param {Bakaru.ClassifiedFolderItems} classes
 * @returns {Promise<Bakaru.Entry>}
 */
export default async function makeSeriesEntry(
  seriesPath: string,
  classes: Bakaru.ClassifiedFolderItems
): Promise<Bakaru.Entry> {
  const flatTree = await classifyNestedFSEntries(seriesPath);

  const entry = make.entry(seriesPath);

  makeSeriesEntryEpisodes(entry, classes.videos);

  const voiceOvers = new Map<string, string[]>();
  const subtitles = new Map<string, string[]>();

  for (const [subPath, subClasses] of flatTree.entries()) {
    if (subPath !== seriesPath) {
      if (subClasses.audios.length > 0) {
        voiceOvers.set(subPath, subClasses.audios);
      }

      if (subClasses.subtitles.length > 0) {
        subtitles.set(subPath, subClasses.subtitles);
      }
    }
  }

  makeSeriesVoiceOvers(entry, voiceOvers);
  makeSeriesSubtitles(entry, subtitles);

  return entry;
}
