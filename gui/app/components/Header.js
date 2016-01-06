import React from 'react';
import { connect } from 'react-redux';

const Header = ({ app }) => {
  return (
    <header>
      <title>BAKARU バカル</title>
      <actions>action</actions>
      <controls>
        <exit dangerouslySetInnerHTML={{__html: '&times;'}} />
        <minimize>
          -
        </minimize>
      </controls>
    </header>
  );
}

export default connect(
  state => ({
    app: state.app
  })
)(Header);
