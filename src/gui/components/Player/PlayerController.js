import Inferno from 'inferno'
import Component from 'inferno-component'
import className from 'classnames'
import MPV from './MPV'

const videoPath = 'D:\\anime\\Durarara!!x2 Shou [BD] [720p]\\[Winter] Durarara!!x2 Shou 02 [BDrip 1280x720 x264 Vorbis].mkv';
const videoPath2 = 'D:\\anime\\Durarara!!x2 Shou [BD] [720p]\\[Winter] Durarara!!x2 Shou 03 [BDrip 1280x720 x264 Vorbis].mkv';

export default class PlayerController extends Component {
  constructor(props) {
    super(props);

    this.mpv = null;

    this.state = {
      loading: true,
      buffering: false,

      time: 0,
      percent: 0,
      chapter: 0,
      timeRemaining: 0,
      chaptersCount: 0,

      muted: false,
      volume: 100.0,

      paused: true
    };
  }

  onReady(mpv) {
    this.mpv = mpv;

    this.mpv.observe('pause');
    this.mpv.observe('volume');
    this.mpv.observe('duration');
    this.mpv.observe('chapter');
    this.mpv.observe('chapters');
    this.mpv.observe('time-pos');
    this.mpv.observe('percent-pos');
    this.mpv.observe('time-remaining');

    this.mpv.property('mute', false);
    this.mpv.property('volume', 50.0);
    this.mpv.command("loadfile", videoPath);

    this.setState({ loading: false });
  }

  onPropertyChange(property, value) {
    switch(property) {
      case 'pause':
        this.setState({ paused: value });
        break;

      case 'percent-pos':
        this.setState({ percent: value });
        break;

      case 'volume':
        this.setState({ volume: value });
        break;

      case 'mute':
        this.setState({ muted: value });
        break;
    }

    console.log('PROP-CHANGE', JSON.stringify(this.state, null, 2));
  }

  togglePause(e) {
    console.log(e);

    if (e.ctrlKey) {
      this.mpv.command('loadfile', videoPath2);
    } else {
      this.mpv.property('pause', !this.state.paused);
    }
  }

  render() {
    const loaderClassName = className({
      loader: true,
      active: this.state.loading || this.state.buffering
    });

    return(
      <div className="player-controller">
        <MPV
          onReady={this.onReady.bind(this)}
          onPropertyChange={this.onPropertyChange.bind(this)}

          onMouseDown={this.togglePause.bind(this)}
        />
        <div className={loaderClassName}/>
      </div>
    );
  }
}
