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


const videoPath = 'D:\\anime\\Durarara!!x2 Shou [BD] [720p]\\[Winter] Durarara!!x2 Shou 02 [BDrip 1280x720 x264 Vorbis].mkv';
const videoPath2 = 'D:\\anime\\[AniDub]_Kiznaiver_[720p]_[ADStudio]\\[AniDub]_Kiznaiver_[07]_[720p_x264_Aac]_[ADStudio].mp4';

const playIcon = (
  <svg
    key="play"
    width={36}
    height={36}
    viewBox="0 0 36 36"
  >
    <path d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z"/>
  </svg>
);

const pauseIcon = (
  <svg
    key="pause"
    width={36}
    height={36}
    viewBox="0 0 36 36"
  >
    <path d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"/>
  </svg>
);

const volumeOff = (
  <svg
    key="volume-off"
    width={16}
    height={16}
    viewBox="0 0 1792 1792"
  >
    <path d="M1280 352v1088q0 26-19 45t-45 19-45-19l-333-333h-262q-26 0-45-19t-19-45v-384q0-26 19-45t45-19h262l333-333q19-19 45-19t45 19 19 45z"/>
  </svg>
);

const volumeDown = (
  <svg
    key="volume-down"
    width={16}
    height={16}
    viewBox="0 0 1792 1792"
  >
    <path d="M1088 352v1088q0 26-19 45t-45 19-45-19l-333-333h-262q-26 0-45-19t-19-45v-384q0-26 19-45t45-19h262l333-333q19-19 45-19t45 19 19 45zm384 544q0 76-42.5 141.5t-112.5 93.5q-10 5-25 5-26 0-45-18.5t-19-45.5q0-21 12-35.5t29-25 34-23 29-35.5 12-57-12-57-29-35.5-34-23-29-25-12-35.5q0-27 19-45.5t45-18.5q15 0 25 5 70 27 112.5 93t42.5 142z"/>
  </svg>
);

const volumeUp = (
  <svg
    key="volume-up"
    width={16}
    height={16}
    viewBox="0 0 1792 1792"
  >
    <path d="M832 352v1088q0 26-19 45t-45 19-45-19l-333-333h-262q-26 0-45-19t-19-45v-384q0-26 19-45t45-19h262l333-333q19-19 45-19t45 19 19 45zm384 544q0 76-42.5 141.5t-112.5 93.5q-10 5-25 5-26 0-45-18.5t-19-45.5q0-21 12-35.5t29-25 34-23 29-35.5 12-57-12-57-29-35.5-34-23-29-25-12-35.5q0-27 19-45.5t45-18.5q15 0 25 5 70 27 112.5 93t42.5 142zm256 0q0 153-85 282.5t-225 188.5q-13 5-25 5-27 0-46-19t-19-45q0-39 39-59 56-29 76-44 74-54 115.5-135.5t41.5-173.5-41.5-173.5-115.5-135.5q-20-15-76-44-39-20-39-59 0-26 19-45t45-19q13 0 26 5 140 59 225 188.5t85 282.5zm256 0q0 230-127 422.5t-338 283.5q-13 5-26 5-26 0-45-19t-19-45q0-36 39-59 7-4 22.5-10.5t22.5-10.5q46-25 82-51 123-91 192-227t69-289-69-289-192-227q-36-26-82-51-7-4-22.5-10.5t-22.5-10.5q-39-23-39-59 0-26 19-45t45-19q13 0 26 5 211 91 338 283.5t127 422.5z"/>
  </svg>
);

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
                {this.props.playing ? playIcon : pauseIcon}
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
