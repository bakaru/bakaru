import React, { Component } from 'react';
import { connect } from 'react-redux';

export default class Header extends Component {
  render () {
    const { addFolder } = this.props.flags;

    const { minimizeMainWindow, openSelectFolderDialog } = this.props;

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
          <exit dangerouslySetInnerHTML={{__html: '&times;'}} onClick={ () => window.close() } />
          <minimize onClick={ () => minimizeMainWindow() }>
            -
          </minimize>
        </controls>
      </header>
    );
  }
}
