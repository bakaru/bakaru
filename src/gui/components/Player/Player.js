import Inferno from 'inferno'
import Component from 'inferno-component'
import { connect } from 'inferno-redux'
import className from 'classnames'
import PlayerController from './PlayerController'
import {
  player,
  library,
  shyLibrary,
  toShyLibrary
} from 'gui/store/modules/ui'

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

class Player extends Component {
  handleMPVReady(mpv) {
    this.mpv = mpv;
    this.mpv.observe("pause");
    this.mpv.observe("time-pos");

    this.setState({ ready: true });
  }

  handlePropertyChange(name, value) {
    this.setState({[name]: value});
  }

  togglePause() {
    this.mpv.property("pause", !this.state.pause);
  }

  render() {
    const playerClassName = className({
      'player': true,
      'mod-focused': this.props.ui.view === player
    });

    return (
      <div className={playerClassName}>
        <PlayerController
          onReady={this.handleMPVReady.bind(this)}
          onPropertyChange={this.handlePropertyChange.bind(this)}
          onMouseDown={this.togglePause.bind(this)}
        />
        <div
          className="library-trigger"
          onClick={this.props.switchToShyLibrary}
        >
          <span>DURARARA</span>
        </div>
        <div className="player-controls-holder">
          <div className="player-controls">

            <div className="buttons">
              <button>
                {playIcon}
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    ui: state.ui
  }),
  dispatch => ({
    switchToShyLibrary: () => dispatch(toShyLibrary())
  })
)(Player);
