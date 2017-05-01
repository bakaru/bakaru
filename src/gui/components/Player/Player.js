import Inferno from 'inferno'
import Component from 'inferno-component'
import PlayerController from './PlayerController'

export default class Player extends Component {
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
    return (
      <div>
        <div>
          {JSON.stringify(this.state)}
        </div>
        <PlayerController
          onReady={this.handleMPVReady.bind(this)}
          onPropertyChange={this.handlePropertyChange.bind(this)}
          onMouseDown={this.togglePause.bind(this)}
        />
      </div>
    );
  }
}
