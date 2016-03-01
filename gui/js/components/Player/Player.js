import React, { Component } from 'react';
import deepEqual from 'deep-equal';
import Mousetrap from 'mousetrap';

import PlayerController from './PlayerController';
import PlayerControls from 'utils/PlayerControls';
import BrowserWindow from 'utils/BrowserWindow';

const FocusEvent = new window.Event('focus');

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
    this.actions = props.actions;
    this.playlist = [];
    this.isFocused = false;
    this.currentPlaylistItem = 0;

    this.postponedPlay = false;

    this.state = {
      time: 0,
      title: '',
      length: 0,
      playing: false,
      uiHidden: false,
      fullscreen: false
    };

    this.uiHideTimer = null;

    this.componentWillReceiveProps(props);
  }

  /**
   * Handles props updates
   *
   * @param {{playlist: [], action: string, actions: Object.<string, function>}} props
   */
  componentWillReceiveProps(props) {
    const { playlist, action } = props;

    if (this.player === null) {
      return;
    }

    if (playlist.length > 0 && (this.playlist.length === 0 || !deepEqual(this.playlist, playlist))) {
      this.setPlaylist(playlist);
      if (this.postponedPlay) {
        this.play();
        this.postponedPlay = false;
      }
    }

    this.isFocused = props.focus === 'player';

    if (this.isFocused) {
      this.refs.canvas.focus();
    }
  }

  /**
   * Initialize player and registers hotkeys when component did mount
   */
  componentDidMount() {
    this.player = new PlayerController(this.wcjs, this.refs.canvas);

    this.player.registerOnEndReachedHandler(::this.next);
    this.player.registerOnLengthHandler(length => this.setState({ length }));
    this.player.registerOnTimeChangeHandler(time => this.setState({ time }));

    PlayerControls.onPlay(() => {
      if (this.playlist.length > 0) {
        this.play();
      } else {
        this.postponedPlay = true;
      }
    });
    PlayerControls.onPause(() => this.pause());

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
      <player className={ this.state.uiHidden ? 'ui-hidden' : '' } onMouseMove={ ::this.showUi } ref="player">
        <canvas-wrapper onClick={ ::this.togglePause } onDoubleClick={ ::this.toggleFullScreen }>
          <canvas ref="canvas" className="canvas"></canvas>
        </canvas-wrapper>
        <title>
          { this.state.title }
        </title>
        <controls>
          <progress-bar onClick={ ::this.seek }>
            <track style={{ width: `${currentPlaybackPercent}%` }} />
          </progress-bar>
          <buttons className="left">
            <btn className="play-pause" onClick={ ::this.togglePause }>
              <i className={ `fa fa-${this.state.playing ? 'pause' : 'play'}` } />
            </btn>
            <btn className="prev" onClick={ ::this.prev }>
              <i className="fa fa-step-backward" />
            </btn>
            <btn className="next" onClick={ ::this.next }>
              <i className="fa fa-step-forward" />
            </btn>
            <btn className="fullscreen" onClick={ ::this.toggleFullScreen }>
              <i className={ `fa fa-${this.state.fullscreen ? 'compress' : 'expand'}` } />
            </btn>
          </buttons>
          <times>
            <time className="now">
              { time }
            </time>
            <time className="end">
              { length }
            </time>
          </times>
        </controls>
      </player>
    );
  }

  /**
   * Toggles fullscreen mode
   */
  toggleFullScreen() {
    const isFullScreen = BrowserWindow.isFullScreen();

    if (isFullScreen) {
      BrowserWindow.exitFullScreen();
    } else {
      BrowserWindow.enterFullScreen();
    }

    this.setState({ fullscreen: !isFullScreen });
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

    this.setMedia(this.playlist[this.currentPlaylistItem = 0]);
    this.showUi();
  }

  setMedia(media) {
    this.player.setMedia(media);
    this.setState({ title: media.title });
  }

  /**
   * Switch to next playlist item if available
   */
  next() {
    if (this.playlist.length === 0 || this.currentPlaylistItem === this.playlist.length - 1) {
      return;
    }

    const media = this.playlist[++this.currentPlaylistItem];

    this.setMedia(media);
    this.play();
  }

  /**
   * Switch to previous playlist item if available
   */
  prev() {
    if (this.playlist.length === 0 || this.currentPlaylistItem === 0) {
      return;
    }

    const media = this.playlist[--this.currentPlaylistItem];

    this.setMedia(media);
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
    Mousetrap.bind('space', () => {
      console.log('[Player] handle space press, im focused:', this.isFocused);

      if (this.isFocused) {
        this.togglePause();
      }
    });

    Mousetrap.bind('esc', this.onlyWhenFocused(() => {
      this.pause();
      this.actions.focusOnLibrary();
    }));
  }

  /**
   * Curry given function to fire only if player is focused
   *
   * @param func
   * @returns {Function}
   */
  onlyWhenFocused(func) {
    return () => this.isFocused && func();
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
