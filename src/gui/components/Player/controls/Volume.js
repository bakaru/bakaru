import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import PlayerControl from 'gui/control/Player'
import {
  volumeUp,
  volumeOff,
  volumeDown
} from 'gui/components/icons'

export class Volume extends PureComponent {
  static propTypes = {
    volume: PropTypes.number.isRequired,
    muted: PropTypes.bool.isRequired,
  };

  onMouseDown(e) {
    e.stopPropagation();

    PlayerControl.mute(!this.props.muted);
  }

  onWheel(e) {
    e.stopPropagation();

    const volume = this.props.volume + (-e.deltaY / 10);

    PlayerControl.volume(
      volume > 100
        ? 100.0
        : (
          volume < 0
            ? 0.0
            : volume
        )
    );
  }

  render() {
    const volumeIcon = this.props.muted || this.props.volume === 0
      ? volumeOff
      : (
        this.props.volume > 40
          ? volumeUp
          : volumeDown
      );

    return (
      <button
        onMouseDown={::this.onMouseDown}
        onWheel={::this.onWheel}
        className="volume"
      >
        <div className="amount" style={{ height: this.props.volume + '%' }}/>
        {volumeIcon}
      </button>
    );
  }
}
