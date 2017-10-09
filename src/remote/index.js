require('./style');

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Backend, { connection } from 'shared/Backend'
import Event from 'shared/Event'
import { play, pause } from 'gui/components/icons'

class Button extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: false
    };
  }

  componentDidMount() {
    Backend.on(Event.PlayerPlay, () => this.setState({ playing: true }));
    Backend.on(Event.PlayerPause, () => this.setState({ playing: false }));
  }

  onTogglePlay(e) {
    e.stopPropagation();

    const playing = !this.state.playing;

    this.setState({ playing });
    Backend.emit(!playing ? Event.PlayerPause : Event.PlayerPlay);
  }

  render() {
    return (
      <button
        onClick={::this.onTogglePlay}
      >
        {this.state.playing ? pause : play}
      </button>
    );
  }
}

connection.then(() => {
  // const store = createStore();

  ReactDOM.render(
    <div>
      Yay!
      <Button/>
    </div>,
    document.getElementById('gui-mount')
  );
});
