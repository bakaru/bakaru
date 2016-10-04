const flatten = require('../flatten');
const make = require('../../coreObjectsCreators');

/**
 * Expands series folder
 *
 * @param {string} seriesPath
 * @param {ClassifiedFolderItems} classes
 * @returns {Promise<Entry>}
 */
function makeSeriesEntry(seriesPath, classes) {
  return flatten(seriesPath).then(flatTree => {
    const entry = make.entry(seriesPath);

    makeSeriesEntryEpisodes(entry, classes.videos);

    const voiceOvers = new Map();
    const subtitles = new Map();

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
  });
}

/**
 * Fills entry with episodes
 *
 * @param {Entry} entry
 * @param {string[]} episodesPaths
 */
function makeSeriesEntryEpisodes(entry, episodesPaths) {
  for (let index = 0; index < episodesPaths.length; index++) {
    const episode = make.episode(episodesPaths[index]);

    entry.episodes.set(episode.id, episode);
  }
}

/**
 * Fills entry with voice-overs
 *
 * @param {Entry} entry
 * @param {Map<string, string[]>} voiceOvers
 */
function makeSeriesVoiceOvers(entry, voiceOvers) {
  for (const [voiceOverPath, voiceOverItems] of voiceOvers.entries()) {
    const voiceOver = make.voiceOver(voiceOverPath, voiceOverItems);

    entry.voiceOvers.set(voiceOver.id, voiceOver);
  }
}

/**
 * Fills entry with subtitles
 *
 * @param {Entry} entry
 * @param {Map<string, string[]>} subtitles
 */
function makeSeriesSubtitles(entry, subtitles) {
  for (const [subtitlePath, subtitleItems] of subtitles.entries()) {
    const subtitle = make.subtitles(subtitlePath, subtitleItems);

    entry.subtitles.set(subtitle.id, subtitle);
  }
}

module.exports = makeSeriesEntry;
