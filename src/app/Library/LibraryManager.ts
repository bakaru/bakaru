const path = require('path');

const MediaDiscovery = require('./MediaDiscovery');
const coreEvents = require('../coreEvents');
const Syncer = require('./Syncer');

/**
 * Boots up Syncer
 *
 * @returns {Syncer}
 */
function bootSyncer() {
  return new Syncer(global.bakaru.paths.library);
}

class Library {

  /**
   * Ctor
   *
   * @param {ServerContext} context
   */
  constructor(context) {
    this.events = context.events;

    this.mediaDiscovery = new MediaDiscovery(context);

    this.syncer = bootSyncer();
    this.syncer.resurrect().then(this.onLibraryResurrect.bind(this));

    /**
     * @type {Map<string, Entry>}
     */
    this.entries = new Map();
    this.voiceOvers = new Map();
    this.subtitles = new Map();

    // Monkey rebinding
    this.onEntryRead = this.onEntryRead.bind(this);

    // Subscribing for events
    this.events.on(coreEvents.entryRead, this.onEntryRead);
  }

  /**
   * Listens for library resurrection event
   *
   * @param {Set<string>} entriesIds
   */
  onLibraryResurrect(entriesIds) {
    for (const entryId of entriesIds) {
      this.syncer.read(entryId).then(entry => this.entryUpdate(entry, false));
    }
  }

  /**
   * Listens for entry read event
   *
   * @param {Entry} entry
   */
  onEntryRead(entry) {
    this.entryUpdate(entry);

    const entryId = entry.id;
    const episodesIds = [...entry.episodes.keys()];
    const firstEpisodeId = episodesIds[0];

    // First let's enqueue discovering the very first episode
    // Just to obtain common media properties of entry
    this.mediaDiscovery.enqueue(
      [entry.episodes.get(firstEpisodeId).path],
      MediaDiscovery.HighPriority
    ).then(([episodeMedia]) => {
      // Due to long time taken by media discovery we simply MUST obtain it from scratch
      const originEntry = this.entries.get(entryId);
      const firstEpisode = originEntry.episodes.get(firstEpisodeId);

      // Setting entry media properties
      originEntry.width = episodeMedia.width;
      originEntry.height = episodeMedia.height;
      originEntry.bitDepth = episodeMedia.bitDepth;

      // Setting episode media properties
      firstEpisode.codec = episodeMedia.codec;
      firstEpisode.chapters = episodeMedia.chapters;
      firstEpisode.duration = episodeMedia.duration;
    });

    if (episodesIds.length > 1) {
      // Only if it is a series we will discover media properties for the rest of the episodes
      this.mediaDiscovery.enqueue(
        [...entry.episodes.values()].map(episode => episode.path),
        MediaDiscovery.LowPriority
      ).then(episodesMedia => {
        const entryEpisodes = this.entries.get(entryId).episodes;
      });
    }
  }

  /**
   * Updates entry
   *
   * @param {Entry} entry
   * @param {boolean} needSync
   */
  entryUpdate(entry, needSync = true) {
    this.entries.set(entry.id, entry);

    this.events.emit(
      coreEvents.entryUpdate,
      entry
    );

    if (needSync) {
      this.syncer.write(entry.id, entry);
    }
  }
}

module.exports = LibraryManager;
