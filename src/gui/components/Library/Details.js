import Inferno from 'inferno'
import Component from 'inferno-component'
import Player from 'gui/control/Player'
import className from 'classnames'

let loadedFor = null;

export default class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {
      audioSelectorOpen: false
    };
  }

  onToggleAudioSelector(e) {
    e.stopPropagation();

    this.setState({ audioSelectorOpen: !this.state.audioSelectorOpen });
  }

  render () {
    const props = this.props;

    const openerClassName = className({
      'library-opener': true,
      'mod-visible': props.isShyLibrary
    })

    if (!props.entry) {
      return (
        <div className="library-details">
          <div className="library-details-placeholder">
            Select entry
          </div>
        </div>
      );
    }

    const entry = props.entry;

    if (loadedFor !== entry.id) {
      loadedFor = entry.id;
      setMedia(entry);
    }

    const audioSelectorClass = className({
      'select': true,
      'mod-open': this.state.audioSelectorOpen
    });

    return (
      <div className="library-details">
        <div
          className={openerClassName}
          onClick={props.switchToLibrary}
        >
        <span>
          {'<<'} Back to library
        </span>
        </div>

        <header>
          {entry.title}
          <div className="entry-path">
            {entry.path}
          </div>
        </header>

        <section className="controls">
          <div className={audioSelectorClass}>
            <div
              className="current"
              onClick={::this.onToggleAudioSelector}
            >
              Audio: something
            </div>
            <ul
              className="list"
              onClick={::this.onToggleAudioSelector}
            >
              <li>Test 1</li>
              <li>Test 2</li>
              <li>Test 2</li>
              <li>Test 2</li>
              <li>Test 2</li>
            </ul>
          </div>

          <button
            onClick={() => { play(); props.switchToPlayer() }}
          >
            Play
          </button>
        </section>

        <section className="desc">
          Yaya desc
        </section>
      </div>
    );
  }
}

function setMedia(entry) {
  const entryId = entry.id;
  const episodeId = [...entry.episodes.keys()][0];

  Player.media(entryId, episodeId);
}

function play() {
  Player.play();
  Player.seek(60.0);
}
