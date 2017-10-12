import React from 'react'
import { connect } from 'react-redux'
import className from 'classnames'
import {
  shyLibrary,
  toPlayer,
  toLibrary,
  library
} from 'gui/store/modules/ui'
import { select } from 'gui/store/modules/library'
import List from './List'
import Details from './Details'

function Library(props) {
  const isShyLibrary = props.ui.view === shyLibrary;
  const isLibrary = props.ui.view === library;

  const playerLibraryOverlayClassName = className({
    'player-library-overlay': true,
    'mod-shy': isShyLibrary
  });

  const libraryContainerClassName = className({
    'library-container': true,
    'mod-shy': isShyLibrary,
    'mod-focused': isLibrary
  });

  const entry = props.library.selected
    ? props.library.entries.get(props.library.selected)
    : null;

  return (
    <div className="library">
      <div
        className={playerLibraryOverlayClassName}
        onClick={props.switchToPlayer}
      />
      <div className={libraryContainerClassName}>
        <List
          items={props.library.entries}
          select={props.selectEntry}
          selected={props.library.selected}
        />
        <Details
          entry={entry}
          isShyLibrary={isShyLibrary}
          switchToLibrary={props.switchToLibrary}
          switchToPlayer={props.switchToPlayer}
        />
      </div>
    </div>
  );
}

export default connect(
  state => ({
    ui: state.ui,
    library: state.library
  }),
  dispatch => ({
    selectEntry: (id) => dispatch(select(id)),
    switchToPlayer: () => dispatch(toPlayer()),
    switchToLibrary: () => dispatch(toLibrary())
  })
)(Library);
