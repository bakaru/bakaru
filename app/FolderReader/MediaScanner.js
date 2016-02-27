'use strict';

class MediaScanner {

  /**
   * Ctor
   *
   * @param {AnimeFolder} animeFolder
   * @callback updateAnimeFolderCallback
   * @param {MediaInfo} mediaInfo
   */
  constructor(animeFolder, updateAnimeFolderCallback, mediaInfo) {
    this.animeFolder= animeFolder;
    this.mediaInfo = mediaInfo;
    this.updateAnimeFolder = updateAnimeFolderCallback;

    this.currentEpisodeIndex = 0;

    this.processCurrentEpisode();
  }

  processCurrentEpisode() {
    const episodePath = this.animeFolder.episodes[this.currentEpisodeIndex].path;

    console.log(`Now scanning ${episodePath}`);

    this.mediaInfo.getInfo([episodePath]).then(episodeInfo => {
      if (episodeInfo.duration !== null) {
        this.animeFolder.quality = `${episodeInfo.video.height}p`;
        this.animeFolder.episodes[this.currentEpisodeIndex].duration = episodeInfo.duration;
        this.animeFolder.media.width = episodeInfo.video.width;
        this.animeFolder.media.height = episodeInfo.video.height;
        this.animeFolder.media.format = episodeInfo.video.format;
        this.animeFolder.media.bitDepth = episodeInfo.video.bitDepth;
        this.animeFolder.state.mediainfoScanning = false;

        this.updateAnimeFolder(this.animeFolder);

        this.animeFolder = null;
        this.updateAnimeFolder = null;
        this.mediaInfo = null;
      } else {
        this.currentEpisodeIndex++;
        this.processCurrentEpisode();
      }
    });
  }
}

module.exports = MediaScanner;