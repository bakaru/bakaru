import React, { Component } from 'react';
import deepEqual from 'deep-equal';
import Mousetrap from 'mousetrap';
import classname from 'classnames';

import PowerSaverBlocker from 'utils/PowerSaverBlocker';
import PlayerController from './PlayerController';
import PlayerControls from 'utils/PlayerControls';
import BrowserWindow from 'utils/BrowserWindow';
import LibraryEvents from 'utils/LibraryEvents';

export default class Player extends Component {

  /**
   * Ctor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.psb = null;
    this.wcjs = props.wcjs;
    this.player = null;
    this.actions = props.actions;

    /**
     * @type {{entries: Map.<string, Anime>}}
     */
    this.library = props.library;
    this.playlist = [];
    this.settings = props.settings;
    this.isFocused = false;
    this.lastVolume = 0;
    this.currentPlaylistItem = 0;

    this.postponedPlay = false;

    this.state = {
      time: 0,
      title: '',
      length: 0,
      volume: 100,
      muted: false,
      playing: false,
      uiHidden: false,
      buffering: false,
      fullscreen: false,
      playlistOpen: false,
      subsOpen: false,
      dubsOpen: false,
      subId: false,
      dubId: false
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
    const { playlist, settings, library } = props;

    this.settings = settings;
    this.library = library;

    if (this.player === null) {
      return;
    }

    if (playlist.length > 0) {
      this.setPlaylist(playlist);
      if (this.postponedPlay) {
        this.play();
        this.postponedPlay = false;
      }
    }

    this.isFocused = props.focus === 'player';
  }

  /**
   * Initialize player and registers hotkeys when component did mount
   */
  componentDidMount() {
    this.player = new PlayerController(this.wcjs, this.refs.canvas);

    this.player.setVolume(this.state.volume);

    this.player.registerOnBufferingHandler(percents => this.setState({ buffering: percents !== 100 }));
    this.player.registerOnEndReachedHandler(::this.next);
    this.player.registerOnLengthHandler(length => this.setState({ length }));
    this.player.registerOnTimeChangeHandler(::this.onTimeChange);

    PlayerControls.onPlay((postponed) => {
      if (postponed) {
        this.postponedPlay = true;
      } else {
        this.play();
      }
    });
    PlayerControls.onPause(() => this.pause());

    this.registerHotkeys();
  }

  onTimeChange(time) {
      this.setState({ time });

      let currentPlaybackPercent;

      if (this.state['length']) {
        currentPlaybackPercent = (1 / this.state.length) * time;
      } else {
        currentPlaybackPercent = 0;
      }

      BrowserWindow.setProgressBar(currentPlaybackPercent);
  }

  /**
   * Renderer
   *
   * @returns {XML}
   */
  render() {
    const currentPlaybackPercent = this.state['length']
      ? (100 / this.state.length) * this.state.time
      : 0;

    const time = this.secondsToHms(this.state.time/1000);
    const length = this.secondsToHms(this.state.length/1000);

    const playerClass = classname({
      'ui-hidden': this.state.uiHidden && !(this.state.playlistOpen || this.state.subsOpen || this.state.dubsOpen)
    });

    const playlistClass = classname({
      open: this.state.playlistOpen
    });

    const playlist = this.playlist.map((media, index) => {
      const entry = this.library.entries.get(media.entryId);
      const episode = entry.episodes.get(media.episodeId);

      return (
        <item className={ this.currentPlaylistItem === index ? 'current' : '' } onClick={ () => this.selectPlaylistItem(index) } key={ entry.id + episode.id }>
          <entry-title>
            { entry.title }
          </entry-title>
          <delimiter>
            &nbsp;-&nbsp;
          </delimiter>
          <episode-title>
            { episode.title }
          </episode-title>
        </item>
      );
    });

    const subs = [];
    const dubs = [];

    if (this.playlist.length > 0) {
      const media = this.playlist[this.currentPlaylistItem];
      const entry = this.library.entries.get(media.entryId);

      if (media.subId) {
        entry.subs.forEach(sub => {
          subs.push(
            <item className={ this.state.subId === sub.id ? 'current' : '' } onClick={ () => this.selectSub(sub.id) } key={ entry.id + sub.id }>
              { sub.title }
            </item>
          );
        });
      }

      entry.dubs.forEach(dub => {
        dubs.push(
          <item className={ this.state.dubId === dub.id ? 'current' : '' } onClick={ () => this.selectDub(dub.id) } key={ entry.id + dub.id }>
            { dub.title }
          </item>
        );
      });
    }

    return (
      <player className={ playerClass } onMouseMove={ ::this.showUi } ref="player">
        <canvas-wrapper onClick={ ::this.handleCanvasClick } onDoubleClick={ ::this.toggleFullScreen }>
          <canvas ref="canvas" className="canvas"></canvas>
        </canvas-wrapper>
        <title>
          { this.state.title }
        </title>
        <loading-indicator style={{ opacity: this.state.buffering ? 1 : 0 }}>
          <i className="fa fa-spin fa-circle-o-notch"/>
        </loading-indicator>
        <nav>
          <btn onClick={ () => this.pause() + this.actions.focusOnSettings() }>
            <i className="fa fa-wrench" />
          </btn>
          <btn onClick={ () => this.pause() + this.actions.focusOnLibrary() + this.exitFullScreen() }>
            <i className="fa fa-reorder" />
          </btn>
        </nav>
        <playlist className={ playlistClass }>
          { playlist }
        </playlist>
        <controls>
          <progress-bar onClick={ ::this.seek }>
            <track style={{ width: `${currentPlaybackPercent}%` }} />
          </progress-bar>
          <row>
            <left>
              <btn className="play-pause" onClick={ ::this.togglePause }>
                <i className={ `fa fa-${this.state.playing ? 'pause' : 'play'}` } />
              </btn>
              <btn className="prev" onClick={ ::this.prev }>
                <i className="fa fa-fast-backward" />
              </btn>
              <btn className="next" onClick={ ::this.next }>
                <i className="fa fa-fast-forward" />
              </btn>
              <volume>
                <btn className="volume" onClick={ ::this.toggleMute }>
                  <i className={ 'fa fa-volume-' + (this.state.volume === 0 ? 'off' : (this.state.volume > 50 ? 'up' : 'down')) } />
                </btn>
                <bar onClick={ ::this.volume }>
                  <track style={{ width: (this.state.volume/2)+'px' }}/>
                </bar>
              </volume>
            </left>
            <right>
              <times>
                <time className="now">
                  { time }
                </time>
                <time className="end">
                  { length }
                </time>
              </times>
              <btn className="subs" onClick={ ::this.toggleSubsSelector } disabled={ subs.length <= 0 }>
                <i className="fa fa-fw fa-text-width"/>
                <dropdown className={ this.state.subsOpen ? 'open' : '' }>
                  { subs }
                </dropdown>
              </btn>
              <btn className="dubs" onClick={ ::this.toggleDubsSelector } disabled={ dubs.length <= 1 }>
                <i className="fa fa-fw fa-microphone"/>
                <dropdown className={ this.state.dubsOpen ? 'open' : '' }>
                  { dubs }
                </dropdown>
              </btn>
              <btn className="playlist" onClick={ ::this.togglePlaylist }>
                <i className="fa fa-fw fa-indent"/>
              </btn>
              <btn className="fullscreen" onClick={ ::this.toggleFullScreen }>
                <i className={ `fa fa-${this.state.fullscreen ? 'compress' : 'expand'}` } />
              </btn>
            </right>
          </row>
        </controls>
      </player>
    );
  }

  /**
   * Toggle subs selector
   */
  toggleSubsSelector() {
    this.setState({
      subsOpen: !this.state.subsOpen,
      dubsOpen: false,
      playlistOpen: false
    });
  }

  /**
   * Toggle dubs selector
   */
  toggleDubsSelector() {
    this.setState({
      dubsOpen: !this.state.dubsOpen,
      subsOpen: false,
      playlistOpen: false
    });
  }

  /**
   * Toggle playlist
   */
  togglePlaylist() {
    this.setState({
      playlistOpen: !this.state.playlistOpen,
      subsOpen: false,
      dubsOpen: false
    });
  }

  /**
   * Select sub
   *
   * @param {string} id
   */
  selectSub(id) {

  }

  /**
   * Select dub
   *
   * @param {string} id
   */
  selectDub(id) {
    const media = this.playlist[this.currentPlaylistItem];
    const entry = this.library.entries.get(media.entryId);
    const dub = entry.dubs.get(id);

    this.setState({ dubId: id });

    if (dub.embedded) {
      this.player.swapAudio(false, parseInt(dub.embeddedIndex));
    } else {
      this.player.swapAudio(`file:///${dub.episodes.get(media.episodeId)}`);
    }
  }

  /**
   * Select media from playlist
   *
   * @param {number} index
   */
  selectPlaylistItem(index) {
    this.setState({ playlistOpen: false });
    this.setMedia(this.playlist[this.currentPlaylistItem = parseInt(index)]);
    this.play();
  }

  /**
   * Handle click on canvas
   */
  handleCanvasClick() {
    if (this.state.playlistOpen || this.state.subsOpen || this.state.dubsOpen) {
      this.setState({
        subsOpen: false,
        dubsOpen: false,
        playlistOpen: false
      });
    }

    if (this.settings.player_pause_on_click) {
      this.togglePause();
    }
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
   * Exit from fullscreen mode
   */
  exitFullScreen() {
    if (BrowserWindow.isFullScreen()) {
      BrowserWindow.exitFullScreen();
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
   * Handle volume change
   *
   * @param event
   */
  volume(event) {
    const clickOnPixel = event.clientX - event.target.offsetLeft;

    if (clickOnPixel <= 5) {
      return this.setVolume(0);
    }
    if (clickOnPixel >= (event.target.offsetWidth - 5)) {
      return this.setVolume(100);
    }

    const clickOnPercent = 100 / event.target.offsetWidth * clickOnPixel;

    this.setVolume(clickOnPercent);
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

  /**
   * Sets currently playing media
   *
   * @param {{entryId: string, episodeId: string, dubId: string, subId: string|boolean, videoFrameSize: Array.<number>}} media
   */
  setMedia(media) {
    const entry = this.library.entries.get(media.entryId);
    const episode = entry.episodes.get(media.episodeId);
    const dub = entry.dubs.get(media.dubId);

    const suitableMedia = {
      videoPath: `file:///${episode.path}`,
      audioPath: false,
      audioIndex: 0,
      subtitlesPath: false,
      subtitlesIndex: 0,
      videoFrameSize: [entry.width, entry.height]
    };

    if (dub.embedded) {
      suitableMedia.audioIndex = parseInt(dub.embeddedIndex);
    } else {
      suitableMedia.audioPath = `file:///${dub.episodes.get(media.episodeId)}`;
    }

    if (media.subId) {
      const sub = entry.subs.get(media.subId);

      if (sub.embedded) {
        suitableMedia.subtitlesIndex = parseInt(sub.embeddedIndex);
      } else {
        suitableMedia.subtitlesPath = `file:///${sub.episodes.get(media.episodeId)}`;
      }
    }

    if (this.settings.player_match_size && !BrowserWindow.isMaximized()) {
      BrowserWindow.setWindowSize(entry.width, entry.height);
    }

    this.player.setMedia(suitableMedia);
    this.setState({
      title: `${entry.title} - ${episode.title}`,
      dubId: media.dubId,
      subId: media.subId
    });
  }

  /**
   * Switch to next playlist item if available
   */
  next() {
    if (this.playlist.length === 0 || this.currentPlaylistItem === this.playlist.length - 1) {
      return;
    }

    const media = this.playlist[++this.currentPlaylistItem];

    this.setState({ buffering: true });
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

    this.setState({ buffering: true });
    this.setMedia(media);
    this.play();
  }

  /**
   * Play
   */
  play() {
    this.player.play();
    this.setState({ playing: true });
    this.blockPowerSaver();
  }

  /**
   * Pauses playback
   */
  pause() {
    this.player.pause();
    this.setState({ playing: false });
    this.unblockPowerSaver();
  }

  /**
   * Toggles mute
   */
  toggleMute() {
    if (this.state.muted) {
      this.setVolume(this.lastVolume);
      this.setState({ muted: false });
    } else {
      this.lastVolume = this.state.volume;
      this.setVolume(0);
      this.setState({ muted: true });
    }
  }

  /**
   * Toggles pause
   */
  togglePause() {
    this.player.togglePause();
    this.setState({ playing: !this.state.playing });
    BrowserWindow.setProgressBar(0);

    if (this.isBlockingPowerSaver()) {
      this.unblockPowerSaver();
    } else {
      this.blockPowerSaver();
    }
  }

  /**
   * Stop playback
   */
  stop() {
    this.player.stop();
    this.setState({ playing: false });
    this.unblockPowerSaver();
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
    Mousetrap.bind('space', () => this.isFocused && this.togglePause());
    Mousetrap.bind('esc', this.onlyWhenFocused(() => {
      this.pause();
      this.actions.focusOnLibrary();
      this.exitFullScreen();
    }));
    Mousetrap.bind('pageup', () => this.isFocused && this.prev());
    Mousetrap.bind('pagedown', () => this.isFocused && this.next());
    Mousetrap.bind('ctrl+left', () => this.isFocused && this.setTime(this.state.time - 10000));
    Mousetrap.bind('ctrl+right', () => this.isFocused && this.setTime(this.state.time + 10000));
    Mousetrap.bind('ctrl+shift+left', () => this.isFocused && this.setTime(this.state.time - 90000));
    Mousetrap.bind('ctrl+shift+right', () => this.isFocused && this.setTime(this.state.time + 90000));
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
   * Start blocking power saver
   */
  blockPowerSaver() {
    if (!this.isBlockingPowerSaver()) {
      this.psb = PowerSaverBlocker.start();
    }
  }

  /**
   * Stops blocking power saver
   */
  unblockPowerSaver() {
    if (this.psb !== null) {
      PowerSaverBlocker.stop(this.psb);
      this.psb = null;
    }
  }

  /**
   * Checks if now blocking power saver
   *
   * @returns {boolean}
   */
  isBlockingPowerSaver() {
    return this.psb === null ? false : PowerSaverBlocker.isStarted(this.psb);
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
