import Inferno from 'inferno'
import { join } from 'path'
import Component from 'inferno-component'
import { connect } from 'inferno-redux'
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
  constructor(props) {
    super(props);

    this.state = {};
    this.initialized = false;
  }

  componentDidUpdate() {
    if (!this.initialized && this.props.library.loaded && this.props.entryId && this.props.episodeId) {
      this.initialized = true;

      PlayerControl.media(this.props.entryId, this.props.episodeId)
    }
  }

  handleMPVReady(mpv) {
    this.mpv = mpv;

    Object.values(props).forEach(this.mpv.observe.bind(mpv));

    PlayerControl.onPlay(() => this.mpv.property(props.pause, false));
    PlayerControl.onPause(() => this.mpv.property(props.pause, true));
    PlayerControl.onSeek(time => this.mpv.property(props.timePos, time));
    PlayerControl.onMedia(media => this.mpv.command(commands.loadfile, this.translateMedia(media)));
    PlayerControl.onVolume(volume => this.mpv.property(props.volume, volume));
    PlayerControl.onMute(mute => this.mpv.property(props.mute, mute));
  }

  handlePropertyChange(name, value) {
    this.setState({[name]: value});
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
          onReady={::this.handleMPVReady}
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
              >
                {this.props.playing ? pause : play}
              </button>
              <button
                onClick={::this.onMute}
                onWheel={::this.onVolume}
              >
                {volumeIcon}
              </button>
            </div>

            <div className="trackbar">
              <div className="progress" style={{ width: `${this.state['percent-pos']*2}%` }}/>
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
    switchToShyLibrary: () => dispatch(toShyLibrary())
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
