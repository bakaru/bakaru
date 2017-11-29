import React from 'react'
import PropTypes from 'prop-types'

export function Buttons(props) {
  return (
    <div className="buttons">
      {props.children}
    </div>
  );
}

Buttons.propTypes = {
  children: PropTypes.node.isRequired,
};
