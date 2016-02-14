import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { minimizeMainWindow, openSelectFolderDialog } from 'ipc';

import * as actions from 'actions';

import Player from '../Player/Player';

import Header from 'components/Header';
import Layer from 'components/Layer';

const Gui = (props) => (
  <gui>
    <dragger></dragger>
    <Player wcjs={ props.wcjs } actions={ props.actions } { ...props.player } />
    <Header
      minimizeMainWindow={ minimizeMainWindow }
      openSelectFolderDialog={ openSelectFolderDialog }
      flags={ props.flags }
      actions={ props.actions }
      playerStatus={ props.player.status }
      playerState={ props.player.state }
    />
    <Layer { ...props } />
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
    openedFolder: state.state.openedFolder,
    player: state.player
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Gui);