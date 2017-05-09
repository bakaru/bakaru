import Inferno from 'inferno'
import { connect } from 'inferno-redux'
import className from 'classnames'
import {
  shyLibrary,
  toPlayer,
  toLibrary,
  library
} from 'gui/store/modules/ui'
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

  return (
    <div className="library">
      <div
        className={playerLibraryOverlayClassName}
        onClick={props.switchToLibrary}
      />
      <div className={libraryContainerClassName}>
        <List
          items={props.library.entries}
        />
        <Details
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
    switchToPlayer: () => dispatch(toPlayer()),
    switchToLibrary: () => dispatch(toLibrary())
  })
)(Library);
