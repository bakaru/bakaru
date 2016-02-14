require('font-awesome/css/font-awesome.css');
require('./style.css');

import React, { Component } from 'react';
import { setupCanvas } from 'webgl-video-renderer';
import deepEqual from 'deep-equal';
import Mousetrap from 'mousetrap';

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
    this.status = 'idle';
    this.internalState = 'blurred';

    this.canvasResizeRequest = true;

    this.state = {
      title: '',
      playing: false,
      length: 0,
      pos: 0,
      uiHidden: false
    };

    this.uiHideTimer = null;

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
        this.play();
      }
      if (props.status === 'paused') {
        this.pause();
      }

      this.status = props.status;
    }

    this.internalState = props.state;
  }

  componentDidMount() {
    this.setupPlayers();
    this.registerHotkeys();
  }

  render() {
    const currentPlaybackPercent = this.state['length']
      ? (100 / this.state.length) * this.state.pos
      : 0;

    const currentTime = this.secondsToHms(this.state.pos/1000);
    const length = this.secondsToHms(this.state.length/1000);

    return (
      <div className={ `bakaru-player ${this.state.uiHidden ? 'ui-hidden' : ''}` } onMouseMove={ ::this.showUi } ref="player">
        <div className="canvas-wrapper" onClick={ ::this.togglePause } onDoubleClick={ ::this.handleDoubleClick }>
          <canvas ref="canvas" className="canvas"></canvas>
        </div>
        <div className="title">
          { this.state.title }
        </div>
        <div className="controls">
          <div className="progressBar" onClick={ ::this.handleSeek }>
            <div className="track" style={{ width: `${currentPlaybackPercent}%` }}></div>
          </div>
          <div className="buttons">
            <button className="play-pause" onClick={ ::this.togglePause }>
              <i className={ `fa fa-${this.state.playing ? 'pause' : 'play'}` }></i>
            </button>
            <button className="prev" onClick={ ::this.prev }>
              <i className="fa fa-step-backward"></i>
            </button>
            <button className="next" onClick={ ::this.next }>
              <i className="fa fa-step-forward"></i>
            </button>
          </div>
          <div className="times">
            <div className="timeNow">
              { currentTime }
            </div>
            <div className="timeEnd">
              { length }
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleDoubleClick() {
    if (window.document.webkitFullscreenElement) {
      window.document.webkitExitFullscreen();
    } else {
      this.refs.player.webkitRequestFullscreen();
    }
  }

  /**
   * Shows UI
   */
  showUi() {
    this.setState({ uiHidden: false });

    clearTimeout(this.uiHideTimer);

    this.uiHideTimer = setTimeout(::this.hideUi, 2000);
  }

  /**
   * Hides UI
   */
  hideUi() {
    this.setState({ uiHidden: true });
  }

  /**
   * Handle seek
   *
   * @param event
   */
  handleSeek(event) {
    const clickOnPercent = 100 / event.target.offsetWidth * (event.clientX - 5);

    this.setTime(this.state.length / 100 * clickOnPercent);
  }

  /**
   * Set playlist
   *
   * @param playlist
   */
  setPlaylist(playlist) {
    console.log(`Player: setPlaylist`);

    this.playlist = Array.from(playlist);
    this.currentPlaylistItem = 0;
    this.setMedia(this.playlist[0]);
    this.showUi();
  }

  /**
   * Set current playing media
   *
   * @param videoPath
   * @param audioPath
   * @param subtitlesPath
   */
  setMedia({ title, videoPath, audioPath, subtitlesPath }) {
    console.log(`Player: setMedia`, this.playlist);

    this.setState({ title });

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

    this.setState({ playing: true });
  }

  /**
   * Pauses playback
   */
  pause() {
    console.log(`Player: pause`);

    this.videoPlayer.pause();
    this.audioPlayer.pause();

    this.setState({ playing: false });
  }

  /**
   * Toggles pause
   */
  togglePause() {
    console.log(`Player: togglePause`);

    this.videoPlayer.togglePause();
    if (this.externalAudio) this.audioPlayer.togglePause();

    this.setState({ playing: !this.state.playing });
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
    this.setState({ pos: time });
  }

  registerHotkeys() {
    Mousetrap.bind('space', this.onlyWhenFocused(::this.togglePause));
    Mousetrap.bind('esc', this.onlyWhenFocused(() => {
      this.actions.playerPause();
      this.actions.playerBlur();
    }));
  }

  onlyWhenFocused(func) {
    return () => {
      if (this.internalState === 'focused') {
        func();
      }
    };
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

    this._setupOnTimeChangedEvent();
    this._setupOnLengthChangedEvent();
    this._setupOnFrameReadyEvent();
    this._setupOnEndReachedEvent();

    this.renderContext.fillBlack();
  }

  _setupOnTimeChangedEvent() {
    this.videoPlayer.onTimeChanged = time => {
      this.setState({pos: time});
    };
  }

  _setupOnLengthChangedEvent() {
    this.videoPlayer.onLengthChanged = length => {
      this.setState({length});
    };
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

    this.videoPlayer.onFrameSetup = (width, height, pixelFormat, videoFrame) => {
      console.log('Frame size', width, height, pixelFormat);
    };

    this.videoPlayer.onFrameReady = frame => {
      if (this.canvasResizeRequest) {
        const windowRatio = window.outerWidth / window.outerHeight;
        const frameRatio = frame.width / frame.height;

        let canvasWidth = 0;
        let canvasHeight = 0;

        if (windowRatio > frameRatio) {
          canvasHeight = window.outerHeight;
          canvasWidth = Math.ceil(canvasHeight * frameRatio);
        } else {
          canvasWidth = window.outerWidth;
          canvasHeight = Math.ceil(canvasWidth / frameRatio);
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

  secondsToHms(d) {
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
  }
}
