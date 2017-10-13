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
import { check, perform } from 'gui/store/modules/update'
import List from './List'
import Details from './Details'
import Backend from 'shared/Backend'
import Event from 'shared/Event'
import * as icons from 'gui/components/icons'

function openDialog() {
  Backend.emit(Event.OpenSystemFolder);
}

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
        <div className="library-controls">
          <input
            type="search"
            placeholder="Filter"
          />

          <div className="button-group">
            <button
              onClick={check}
              className="iconed"
            >
              {icons.refreshCw}
            </button>

            <button
              className="iconed"
            >
              {icons.settings}
            </button>

            <button
              onClick={openDialog}
              className="iconed adder"
            >
              {icons.plusCircle}
            </button>
          </div>
        </div>
        <List
          items={props.library.entries}
          select={props.selectEntry}
          selected={props.library.selected}
        />
        <Details
          entry={entry}
          currentEntryId={props.player.entryId}
          currentEpisodeId={props.player.episodeId}
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
    player: state.player,
    update: state.update,
    library: state.library
  }),
  dispatch => ({
    selectEntry: (id) => dispatch(select(id)),
    switchToPlayer: () => dispatch(toPlayer()),
    switchToLibrary: () => dispatch(toLibrary())
  })
)(Library);
