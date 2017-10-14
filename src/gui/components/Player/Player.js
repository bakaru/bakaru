import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { join } from 'path'
import { connect } from 'react-redux'
import className from 'classnames'
import PlayerControl from 'gui/control/Player'
import PlayerController from './PlayerController'
import {
  player,
  library,
  shyLibrary,
  toShyLibrary
} from 'gui/store/modules/ui'
import {
  setWatched,
  setStoppedAt
} from 'gui/store/modules/library'

import {
  play,
  pause,
  volumeUp,
  volumeOff,
  volumeDown
} from 'gui/components/icons'

const props = {
  mute: 'mute',
  pause: 'pause',
  volume: 'volume',
  duration: 'duration',
  chapter: 'chapter',
  chapters: 'chapters',
  timePos: 'time-pos',
  percentPos: 'percent-pos',
  timeRemaining: 'time-remainin'
};

const commands = {
  loadfile: 'loadfile'
};

class Player extends Component {
  static propTypes = {
    watched: PropTypes.func.isRequired,
    stopped: PropTypes.func.isRequired,
    switchToShyLibrary: PropTypes.func.isRequired,

    ui: PropTypes.object.isRequired,
    library: PropTypes.object.isRequired,
  };

  state = {};
  initialized = false;

  componentDidMount() {
    setInterval(() => {
      if (!this.state[props.pause]) {
        this.advanceTime();
      }
    }, 1000);
  }

  componentDidUpdate() {
    if (!this.initialized && this.props.library.loaded && this.props.entryId && this.props.episodeId) {
      this.initialized = true;

      PlayerControl.media(this.props.entryId, this.props.episodeId)
    }
  }

  mountMPV(mpv) {
    this.mpv = mpv;

    Object.values(props).forEach(this.mpv.observe.bind(mpv));

    PlayerControl.onPlay(() => this.mpv.property(props.pause, false) && this.advanceTime());
    PlayerControl.onPause(() => this.mpv.property(props.pause, true) && this.advanceTime());
    PlayerControl.onSeek(time => this.mpv.property(props.timePos, time));
    PlayerControl.onMedia(media => this.mpv.command(commands.loadfile, this.translateMedia(media)));
    PlayerControl.onVolume(volume => this.mpv.property(props.volume, volume));
    PlayerControl.onMute(mute => this.mpv.property(props.mute, mute));
  }

  handlePropertyChange(name, value) {
    this.setState({[name]: value});
  }

  advanceTime() {
    const entryId = this.props.entryId;
    const episodeId = this.props.episodeId;

    if (!entryId || !episodeId) {
      return;
    }

    const episode = this.props.library.entries.get(entryId).episodes.get(episodeId);

    const time = this.state[props.timePos];
    const duration = this.state[props.duration];

    this.props.stopped(entryId, episodeId, time);

    if (!episode.watched && time / duration > .8) {
      this.props.watched(entryId, episodeId);
    }
  }

  togglePause(e) {
    e.stopPropagation();

    if (this.props.playing) {
      PlayerControl.pause();
    } else {
      PlayerControl.play();
    }
  }

  translateMedia({ entryId, episodeId }) {
    return this.props.library.entries.get(entryId).episodes.get(episodeId).path;
  }

  onVolume(e) {
    e.stopPropagation();

    const volume = this.props.volume + (-e.deltaY / 10);

    PlayerControl.volume(volume > 100 ? 100.0 : (volume < 0 ? 0.0 : volume));
  }

  onMute(e) {
    e.stopPropagation();

    PlayerControl.mute(!this.props.muted);
  }

  onSeek(e) {
    const x = e.clientX;
    const rect = e.target.getBoundingClientRect();
    const tx = (x - rect.left) / rect.width;

    PlayerControl.seek(tx * this.state[props.duration]);
  }

  render() {
    const playerClassName = className({
      'player': true,
      'mod-focused': this.props.ui.view === player
    });

    const time = `${formatSeconds(this.state['time-pos'])} / ${formatSeconds(this.state.duration)}`;

    const volumeIcon = this.props.muted || this.props.volume === 0
      ? volumeOff
      : (
        this.props.volume > 40
          ? volumeUp
          : volumeDown
      );

    return (
      <div className={playerClassName}>
        <PlayerController
          onReady={::this.mountMPV}
          onPropertyChange={::this.handlePropertyChange}
          onClickOnCanvas={::this.togglePause}
        />
        <div
          className="library-trigger"
          onClick={this.props.switchToShyLibrary}
        >
          <span>YES,&nbsp;SEMPAI</span>
        </div>
        <div className="player-controls-holder">
          <div className="player-controls">
            <div className="buttons">
              <button
                onClick={::this.togglePause}
                className="play-pause"
              >
                {this.props.playing ? pause : play}
              </button>
              <button
                onClick={::this.onMute}
                onWheel={::this.onVolume}
                className="volume"
              >
                <div className="amount" style={{ height: this.props.volume + '%' }}/>
                {volumeIcon}
              </button>
            </div>

            <div className="trackbar" onMouseDown={::this.onSeek}>
              <div className="progress" style={{ width: `${this.state['percent-pos']}%` }}/>
              <div className="time">
                {time}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    ui: state.ui,
    library: state.library,
    ...state.player
  }),
  dispatch => ({
    switchToShyLibrary: () => dispatch(toShyLibrary()),
    watched: (ent, ep) => dispatch(setWatched(ent, ep)),
    stopped: (ent, ep, time) => dispatch(setStoppedAt(ent, ep, time)),
  })
)(Player);

function formatSeconds(s) {
  const hours = s / 3600 | 0;
  const minutes = (s % 3600) / 60 | 0;
  const seconds = (s % 3600) % 60 | 0;

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  } else {
    return `${pad(minutes)}:${pad(seconds)}`;
  }
}

function pad(s) {
  return s < 10 ? '0'+s : s;
}
