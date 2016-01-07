import React, { Component } from 'react';
import { connect } from 'react-redux';
import { minimizeMainWindow } from '../rpc';

class Header extends Component {
  render () {
    return (
      <header>
        <title>BAKARU バカル</title>
        <actions>action</actions>
        <controls>
          <exit dangerouslySetInnerHTML={{__html: '&times;'}} onClick={::this.handleExitClick} />
          <minimize onClick={::this.handleMinimizeClick}>
            -
          </minimize>
        </controls>
      </header>
    );
  }

  handleExitClick () {
    window.close();
  }

  handleMinimizeClick () {
    minimizeMainWindow();
  }
}

export default connect(
  state => ({
    app: state.app
  })
)(Header);
