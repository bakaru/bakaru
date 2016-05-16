'use strict';

const sha224 = require('js-sha256').sha224;
const events = require('../events').renderer;

class MediaScanner {

  /**
   * Ctor
   *
   * @callback send
   * @param {MediaInfo} mediaInfo
   */
  constructor(animeId, animeTitle, episodes, send, mediaInfo) {
    this.animeId = animeId;
    this.animeTitle = animeTitle;
    this.episodes = episodes;

    this.mediaInfo = mediaInfo;
    this.send = send;

    this.currentEpisodeIndex = 0;

    // Sending media info scanning started
    this.send(events.startMediaInfoScanning, { id: this.animeId });

    this.processCurrentEpisode();
  }

  processCurrentEpisode() {
    const episodePath = this.animeFolder.episodes[this.currentEpisodeIndex].path;

    console.log(`Now scanning ${episodePath}`);

    this.mediaInfo.getInfo([episodePath]).then(episodeInfo => {
      if (episodeInfo.duration !== null) {

        // Sending media info
        this.send(events.setMediaInfo, {
          id: this.animeId,
          mediaInfo: {
            width: episodeInfo.video.width,
            height: episodeInfo.video.height,
            format: episodeInfo.video.format,
            bitDepth: episodeInfo.video.bitDepth
          }
        });

        // Sending discovered episode duration
        this.send(events.updateEpisode, {
          id: this.animeId,
          episodeStub: {
            duration: episodeInfo.duration
          }
        });

        // Processing dubs
        if (episodeInfo.audio.length > 0) {
          const dubsStubs = episodeInfo.audio.map(audio => {
            const dubId = sha224(`${episodePath}:${audio.id}`);

            let title = audio.title
              ? audio.title
              : `${this.animeTitle}:${audio.id}`;

            if (audio.language) {
              title += ` [${audio.language}]`;
            }

            return {
              id: dubId,
              title,
              embedded: true,
              embeddedStreamIndex: audio.id
            };
          });

          // Sending embedded dubs
          this.send(events.updateDubs, { id: this.animeId, dubsStubs });
        }

        // Sending media info scanning done
        this.send(events.stopMediaInfoScanning, { id: this.animeId });

        // Preventing memory leaks
        this.animeFolder = null;
        this.updateAnimeFolder = null;
        this.mediaInfo = null;

      } else {

        // Sending episode invalid
        this.send(events.updateEpisode, {
          id: this.animeId,
          episodeStub: {
            duration: false
          }
        });

        this.currentEpisodeIndex++;
        this.processCurrentEpisode();
      }
    });
  }
}

module.exports = MediaScanner;