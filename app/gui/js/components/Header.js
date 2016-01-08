import React, { Component } from 'react';
import { connect } from 'react-redux';
import { minimizeMainWindow, openSelectFolderDialog } from 'rpc';

class Header extends Component {
  render () {
    return (
      <header>
        <title>BAKARU バカル</title>
        <actions>
          <button onClick={ () => openSelectFolderDialog() }>
            Add folder
          </button>
        </actions>
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
