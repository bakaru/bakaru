import React from 'react';
import { connect } from 'react-redux';
import { minimizeMainWindow, openSelectFolderDialog } from 'ipc';

import Header from 'components/Header';
import Layer from 'components/Layer';

const Gui = (props) => (
  <gui>
    <Header minimizeMainWindow={ minimizeMainWindow } openSelectFolderDialog={ openSelectFolderDialog } flags={ props.flags } />
    <Layer />
  </gui>
);

function mapStateToProps(state) {
  return {
    flags: state.flags,
    state: state.state,
    folders: state.folders
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Gui);