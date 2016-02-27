import React, { Component } from 'react';
import deepEqual from 'deep-equal';
import Mousetrap from 'mousetrap';

import PlayerController from './PlayerController';
import BrowserWindow from 'utils/BrowserWindow';

export default class Player extends Component {

  /**
   * Ctor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.wcjs = props.wcjs;
    this.player = null;
    this.status = 'idle';
    this.actions = props.actions;
    this.playlist = false;
    this.internalState = 'blurred';
    this.currentPlaylistItem = 0;

    this.state = {
      time: 0,
      title: '',
      length: 0,
      playing: false,
      uiHidden: false
    };

    this.uiHideTimer = null;

    this.componentWillReceiveProps(props);
  }

  /**
   * Handles props updates
   *
   * @param props
   */
  componentWillReceiveProps(props) {
    if (this.player === null) {
      return;
    }

    if (props.playlist && (!this.playlist || !deepEqual(this.playlist, props.playlist))) {
      this.setPlaylist(props.playlist);
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

  /**
   * Initialize player and registers hotkeys when component did mount
   */
  componentDidMount() {
    this.player = new PlayerController(this.wcjs, this.refs.canvas);

    this.player.registerOnEndReachedHandler(::this.next);
    this.player.registerOnLengthHandler(length => this.setState({ length }));
    this.player.registerOnTimeChangeHandler(time => this.setState({ time }));

    this.registerHotkeys();
  }

  /**
   * Render FFS
   *
   * @returns {XML}
   */
  render() {
    const currentPlaybackPercent = this.state['length']
      ? (100 / this.state.length) * this.state.time
      : 0;

    const time = this.secondsToHms(this.state.time/1000);
    const length = this.secondsToHms(this.state.length/1000);

    return (
      <div className={ `bakaru-player ${this.state.uiHidden ? 'ui-hidden' : ''}` } onMouseMove={ ::this.showUi } ref="player">
        <div className="canvas-wrapper" onClick={ ::this.togglePause } onDoubleClick={ ::this.toggleFullScreen }>
          <canvas ref="canvas" className="canvas"></canvas>
        </div>
        <div className="title">
          { this.state.title }
        </div>
        <div className="controls">
          <div className="progressBar" onClick={ ::this.seek }>
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
              { time }
            </div>
            <div className="timeEnd">
              { length }
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Toggles fullscreen mode
   */
  toggleFullScreen() {
    if (BrowserWindow.isFullScreen()) {
      BrowserWindow.exitFullScreen();
    } else {
      BrowserWindow.enterFullScreen();
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
  seek(event) {
    const clickOnPercent = 100 / event.target.offsetWidth * (event.clientX - 5);

    this.setTime(this.state.length / 100 * clickOnPercent);
  }

  /**
   * Set playlist
   *
   * @param playlist
   */
  setPlaylist(playlist) {
    this.playlist = playlist.slice();

    this.player.setMedia(this.playlist[this.currentPlaylistItem = 0]);
    this.showUi();
  }

  /**
   * Switch to next playlist item if available
   */
  next() {
    if (this.playlist === false || this.currentPlaylistItem === this.playlist.length - 1) {
      return;
    }

    const media = this.playlist[++this.currentPlaylistItem];

    this.setState({ title: media.title });
    this.player.setMedia(media);
    this.play();
  }

  /**
   * Switch to previous playlist item if available
   */
  prev() {
    if (this.playlist === false || this.currentPlaylistItem === 0) {
      return;
    }

    const media = this.playlist[--this.currentPlaylistItem];

    this.setState({ title: media.title });
    this.player.setMedia(media);
    this.play();
  }

  /**
   * Play
   */
  play() {
    this.player.play();
    this.setState({ playing: true });
  }

  /**
   * Pauses playback
   */
  pause() {
    this.player.pause();
    this.setState({ playing: false });
  }

  /**
   * Toggles pause
   */
  togglePause() {
    this.player.togglePause();
    this.setState({ playing: !this.state.playing });
  }

  /**
   * Stop playback
   */
  stop() {
    this.player.stop();
    this.setState({ playing: false });
  }

  /**
   * Set volume
   *
   * @param {number} volume
   */
  setVolume(volume) {
    this.player.setVolume(volume);
    this.setState({ volume });
  }

  /**
   * Set current time for video
   *
   * @param {number} time
   */
  setTime(time) {
    this.player.setTime(time);
    this.setState({ time });
  }

  /**
   * Registers hotkeys
   */
  registerHotkeys() {
    Mousetrap.bind('space', this.onlyWhenFocused(() => {
      this.player.togglePause();
    }));

    Mousetrap.bind('esc', this.onlyWhenFocused(() => {
      this.actions.playerPause();
      this.actions.playerBlur();
    }));
  }

  /**
   * Curry given function to fire only if player is focused
   *
   * @param func
   * @returns {Function}
   */
  onlyWhenFocused(func) {
    return () => {
      if (this.internalState === 'focused') {
        func();
      }
    };
  }

  /**
   * Converts seconds to human format of hh:mm:ss
   *
   * @param {number} d
   * @returns {string}
   */
  secondsToHms(d) {
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
  }
}
