import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { openSelectFolderDialog } from 'ipc';

import * as actions from 'actions';

import Player from 'components/Player';
import Header from 'components/Header';
import Library from 'components/Library';

const Gui = (props) => (
  <gui>
    <dragger></dragger>
    <Player
      wcjs={ props.wcjs }
      focus={ props.focus }
      actions={ props.actions }
      settings={ props.settings }
      library={ props.library }
      { ...props.player }
    />
    <Header
      focus={ props.focus }
      flags={ props.flags }
      actions={ props.actions }
      playerActive={ props.player.playlist.length > 0 }
    />
    <Library { ...props } />
  </gui>
);

/**
 * @param {{}} state
 * @returns {{flags: (*|Window.CustomElements.flags|{}|Window.HTMLImports.flags|string), state: *, folders: (*|Array|string[]), folder, openedFolder: *, player: (*|player|null)}}
 */
function mapStateToProps(state) {
  return {
    flags: state.flags,
    focus: state.focus,
    player: state.player,
    library: state.library,
    settings: state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Gui);