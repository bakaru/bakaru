import React from 'react'
import PropTypes from 'prop-types'

export function LibraryTrigger(props) {
  return (
    <div
      onClick={props.trigger}
      className="library-trigger"
    >
      <span>
        YES,&nbsp;SEMPAI
      </span>
    </div>
  );
}

LibraryTrigger.propTypes = {
  trigger: PropTypes.func.isRequired,
};
