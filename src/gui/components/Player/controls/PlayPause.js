import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import PlayerControl from 'gui/control/Player'
import { play, pause } from 'gui/components/icons'

export class PlayPause extends PureComponent {
  static propTypes = {
    playing: PropTypes.bool.isRequired,
  };

  togglePause() {
    if (this.props.playing) {
      PlayerControl.pause();
    } else {
      PlayerControl.play();
    }
  }

  render() {
    return (
      <button
        onMouseDown={::this.togglePause}
        className="play-pause"
      >
        {this.props.playing ? pause : play}
      </button>
    );
  }
}
