import React from 'react';
import { connect } from 'react-redux';
import { minimizeMainWindow, openSelectFolderDialog } from 'ipc';

import Header from 'components/Header';
import Layer from 'components/Layer';

const Gui = (props) => (
  <gui>
    <Header minimizeMainWindow={ minimizeMainWindow } openSelectFolderDialog={ openSelectFolderDialog } flags={ props.flags } />
    <Layer { ...props} />
  </gui>
);

function mapStateToProps(state) {
  return {
    flags: state.flags,
    state: state.state,
    folders: state.folders,
    folder: (openedFolder => {
      if (openedFolder === null) {
        return false;
      }

      return state.folders.get(openedFolder);
    })(state.state.openedFolder),
    openedFolder: state.state.openedFolder
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Gui);