import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import className from 'classnames'
import PlayerControl from 'gui/control/Player'
import PlayerController from './MPV/PlayerController'
import {
  player,
  toShyLibrary
} from 'gui/store/modules/ui'
import {
  setWatched,
  setStoppedAt
} from 'gui/store/modules/library'
import { PlayPause } from 'gui/components/Player/controls/PlayPause'
import { Volume } from 'gui/components/Player/controls/Volume'
import { TrackBar } from 'gui/components/Player/controls/TrackBar'
import { Controls } from 'gui/components/Player/controls/Controls'
import { Buttons } from 'gui/components/Player/controls/Buttons'
import { LibraryTrigger } from 'gui/components/Player/controls/LibraryTrigger'

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

    const entry = this.props.library.entries.get(entryId);

    if (!entry) {
      return;
    }

    const episode = entry.episodes.get(episodeId);

    const time = this.state[props.timePos];
    const duration = this.state[props.duration];

    this.props.stopped(entryId, episodeId, time);

    if (!episode.watched && time / duration > .8) {
      this.props.watched(entryId, episodeId);
    }
  }

  translateMedia({ entryId, episodeId }) {
    return this.props.library.entries.get(entryId).episodes.get(episodeId).path;
  }

  togglePause(e) {
    e.stopPropagation();

    if (this.props.playing) {
      PlayerControl.pause();
    } else {
      PlayerControl.play();
    }
  }

  render() {
    const playerClassName = className({
      'player': true,
      'mod-focused': this.props.ui.view === player
    });

    return (
      <div className={playerClassName}>
        <PlayerController
          onReady={::this.mountMPV}
          onPropertyChange={::this.handlePropertyChange}
          onClickOnCanvas={::this.togglePause}
        />

        <LibraryTrigger
          trigger={this.props.switchToShyLibrary}
        />

        <Controls>
          <Buttons>
            <PlayPause
              playing={this.props.playing}
            />
            <Volume
              volume={this.props.volume}
              muted={this.props.muted}
            />
          </Buttons>

          <TrackBar
            time={this.state[props.timePos]}
            duration={this.state[props.duration]}
          />
        </Controls>
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
