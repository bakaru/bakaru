import Inferno from 'inferno'
import Component from 'inferno-component'
import className from 'classnames'
import MPV from './MPV'

export default class PlayerController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  onReady(mpv) {
    this.setState({ loading: false });
    this.props.onReady(mpv);
  }

  render() {
    const loaderClassName = className({
      loader: true,
      active: this.state.loading
    });

    return(
      <div className="player-controller">
        <MPV
          onReady={this.onReady.bind(this)}
          onPropertyChange={this.props.onPropertyChange}

          onClickOnCanvas={this.props.onClickOnCanvas}
        />
        <div className={loaderClassName}/>
      </div>
    );
  }
}
