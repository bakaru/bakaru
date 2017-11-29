import React from 'react'
import PropTypes from 'prop-types'

export function Controls(props) {
  return (
    <div className="player-controls-holder">
      <div className="player-controls">
        {props.children}
      </div>
    </div>
  );
}

Controls.propTypes = {
  children: PropTypes.node.isRequired,
};
