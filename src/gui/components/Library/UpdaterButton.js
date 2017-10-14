import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { check, perform } from 'gui/store/modules/update'
import * as icons from 'gui/components/icons'
import className from 'classnames'

function UpdaterButton(props) {
  const {
    checking,
    available,
    downloading,
    downloadInfo,
    downloaded
  } = props;

  let icon;
  let action = () => {};

  const buttonClassName = {
    'updater-button': true,
    idle: !checking && !available && !downloading && !downloaded,
    available
  };

  switch (true) {
    case checking:
      icon = <div className="spinner"/>;
      break;

    case available:
      icon = icons.sunrise;
      action = perform;
      break;

    default:
      icon = icons.refreshCw;
      action = check;
  }

  return (
    <button
      disabled={checking}
      className={className(buttonClassName)}
      onClick={action}
    >
      {icon}
    </button>
  );
}

export default connect(
  state => state.update
)(UpdaterButton);
