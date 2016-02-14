require('font-awesome/css/font-awesome.css');
require('./style.css');

import React, { Component } from 'react';
import { setupCanvas } from 'webgl-video-renderer';
import deepEqual from 'deep-equal';

export default class Player extends Component {
  constructor(props) {
    super(props);

    this.actions = props.actions;

    this.wcjs = props.wcjs;

    /** @type {VlcPlayer} */
    this.videoPlayer = null;
    /** @type {VlcPlayer} */
    this.audioPlayer = null;

    this.externalAudio = false;
    this.playlist = false;
    this.currentPlaylistItem = 0;

    this.canvasResizeRequest = true;

    this.componentWillReceiveProps(props);
  }

  componentWillReceiveProps(props) {
    if (this.videoPlayer === null || this.audioPlayer === null) {
      return;
    }

    if (props.playlist) {
      if (this.playlist) {
        if (deepEqual(this.playlist, props.playlist) === false) {
          this.setPlaylist(props.playlist);
        }
      } else {
        this.setPlaylist(props.playlist);
      }
    }

    if (props.status !== this.status) {
      if (props.status === 'playing') {
        if (this.state === 'paused') {
          this.togglePause();
        } else {
          this.play();
        }
      }
      if (props.status === 'paused') {
        this.pause();
      }

      this.status = props.status;
    }
  }

  componentDidMount() {
    this.setupPlayers();
  }

  render() {
    return (
      <div className="bakaru-player" onClick={ ::this.togglePause }>
        <canvas ref="canvas" className="canvas"></canvas>
        <div className="controls">
          Here will be controls!
        </div>
      </div>
    );
  }

  /**
   * Set playlist
   *
   * @param playlist
   */
  setPlaylist(playlist) {
    console.log(`Player: setPlaylist`);

    this.playlist = playlist;
    this.currentPlaylistItem = 0;
    this.setMedia(this.playlist[0]);
  }

  /**
   * Set current playing media
   *
   * @param videoPath
   * @param audioPath
   * @param subtitlesPath
   */
  setMedia({ videoPath, audioPath, subtitlesPath }) {
    console.log(`Player: setMedia`);

    this.videoPlayer.playlist.clear();
    this.audioPlayer.playlist.clear();

    this.videoPlayer.playlist.add(videoPath);

    if (audioPath) {
      this.externalAudio = true;
      this.videoPlayer.volume = 0;

      this.audioPlayer.playlist.add(audioPath);
    } else {
      this.externalAudio = false;
      this.videoPlayer.volume = 100;
    }

    this.setVolume(100);
  }

  /**
   * Switch to next playlist item if available
   */
  next() {
    if (this.playlist === false) {
      return;
    }

    if (this.currentPlaylistItem === this.playlist.length - 1) {
      return;
    }

    this.currentPlaylistItem++;

    this.setMedia(this.playlist[this.currentPlaylistItem]);

    this.play();
  }

  /**
   * Switch to previous playlist item if available
   */
  prev() {
    if (this.playlist === false) {
      return;
    }

    if (this.currentPlaylistItem === 0) {
      return;
    }

    this.currentPlaylistItem--;

    this.setMedia(this.playlist[this.currentPlaylistItem]);

    this.play();
  }

  /**
   * Play
   */
  play() {
    console.log(`Player: play`);

    if (this.externalAudio) {
      this.videoPlayer.play();
      this.audioPlayer.play();

      this.audioPlayer.time = this.videoPlayer.time;
    } else {
      this.videoPlayer.play();
    }
  }

  /**
   * Pauses playback
   */
  pause() {
    console.log(`Player: pause`);

    this.videoPlayer.pause();
    this.audioPlayer.pause();
  }

  /**
   * Toggles pause
   */
  togglePause() {
    console.log(`Player: togglePause`);

    this.videoPlayer.togglePause();
    if (this.externalAudio) this.audioPlayer.togglePause();
  }

  /**
   * Stop playback
   */
  stop() {
    console.log(`Player: stop`);

    this.videoPlayer.stop();
    if (this.externalAudio) this.audioPlayer.stop();
  }

  /**
   * Set volume
   *
   * @param volume
   */
  setVolume(volume) {
    if (this.externalAudio) {
      this.audioPlayer.volume = volume;
    } else {
      this.videoPlayer.volume = volume;
    }
  }

  /**
   * Set current time for video
   *
   * @param time
   */
  setTime(time) {
    this.videoPlayer.time = time;
    if (this.externalAudio) this.audioPlayer.time = time;
  }

  /**
   * Setups video and audio players
   */
  setupPlayers() {
    window.videoPlayer = this.videoPlayer = this.wcjs.createPlayer();
    window.audioPlayer = this.audioPlayer = this.wcjs.createPlayer();

    this.renderContext = setupCanvas(this.refs.canvas, {
      preserveDrawingBuffer: true
    });

    window.addEventListener('resize', () => this.canvasResizeRequest = true);

    this._setupOnFrameReadyEvent();
    this._setupOnEndReachedEvent();

    this.renderContext.fillBlack();
  }

  /**
   * @private
   */
  _setupOnEndReachedEvent() {
    this.videoPlayer.onEndReached = ::this.next;
  }

  /**
   * @private
   */
  _setupOnFrameReadyEvent() {
    const gl = this.renderContext.gl;

    this.videoPlayer.onFrameReady = frame => {
      if (this.canvasResizeRequest) {
        const windowRatio = window.outerWidth / window.outerHeight;
        const frameRatio = frame.width / frame.height;

        let canvasWidth = 0;
        let canvasHeight = 0;

        if (windowRatio > frameRatio) {
          canvasHeight = window.outerHeight;
          canvasWidth = canvasHeight * frameRatio |0;
        } else {
          canvasWidth = window.outerWidth;
          canvasHeight = canvasWidth / frameRatio |0;
        }

        this.refs.canvas.width = canvasWidth;
        this.refs.canvas.height = canvasHeight;

        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

        this.canvasResizeRequest = false;
      }

      gl.y.fill(frame.width, frame.height, frame.subarray(0, frame.uOffset));
      gl.u.fill(frame.width >> 1, frame.height >> 1, frame.subarray(frame.uOffset, frame.vOffset));
      gl.v.fill(frame.width >> 1, frame.height >> 1, frame.subarray(frame.vOffset, frame.length));

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
  }
}
