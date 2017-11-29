import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import PlayerControl from 'gui/control/Player'

export class TrackBar extends PureComponent {
  static propTypes = {
    time: PropTypes.number,
    duration: PropTypes.number,
  };

  static defaultProps = {
    time: -1,
    duration: -1,
  };

  onSeek(e) {
    const x = e.clientX;
    const rect = e.target.getBoundingClientRect();
    const tx = (x - rect.left) / rect.width;

    PlayerControl.seek(tx * this.props.duration);
  }

  render() {
    const { time, duration } = this.props;

    const timeHuman = `${formatSeconds(time)} / ${formatSeconds(duration)}`;
    const timePercentage = 100 * (time / duration);

    return (
      <div className="trackbar" onMouseDown={::this.onSeek}>
        <div className="progress" style={{ width: `${timePercentage}%` }}/>
        <div className="time">
          {timeHuman}
        </div>
      </div>
    );
  }
}

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
