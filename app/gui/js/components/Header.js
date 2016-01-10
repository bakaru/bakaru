import React, { Component } from 'react';
import { connect } from 'react-redux';
import { minimizeMainWindow, openSelectFolderDialog } from 'ipc';

class Header extends Component {
  render () {
    const { addFolder } = this.props;

    let addFolderButton;

    if (addFolder) {
      addFolderButton = (
        <button key="add-folder-button" onClick={ () => openSelectFolderDialog() } disabled={ addFolder }>
          <i className="fa fa-circle-o-notch fa-spin"></i>
        </button>
      );
    } else {
      addFolderButton = (
        <button key="add-folder-button" onClick={ () => openSelectFolderDialog() }>
          Add folder
        </button>
      );
    }

    return (
      <header>
        <title>BAKARU バカル</title>
        <actions>
          { addFolderButton }
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
    ...state.flags
  })
)(Header);
