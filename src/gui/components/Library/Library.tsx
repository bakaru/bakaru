import * as React from 'react';
import { connect } from 'react-redux';
import { State as LibraryState, selectEntry as selectEntryAction } from 'gui/store/ducks/library';
import { State as StoreState } from 'gui/store/ducks';
import {
  LibraryContainer,
  PlayerLibraryOverlay,
  LibraryEntryDetails,
  LibraryOpener
} from './libraryElements';
import { Btn } from 'gui/components/common';

import LibraryList from './List';

interface LibraryOwnProps {
  switchToShyLibrary: (() => void),
  switchToLibrary: (() => void),
  switchToPlayer: (() => void),

  focused?: boolean,
  shy?: boolean
}

interface LibraryMapStateProps {
  library: LibraryState
}

interface LibraryMapDispatchProps {
  selectEntry: (entryId: string) => void
}

class Library extends React.Component<LibraryOwnProps & LibraryMapStateProps & LibraryMapDispatchProps, {}> {
  public defaultProps = {
    focused: true,
    shy: false
  };

  render() {
    return (
      <div>
        <PlayerLibraryOverlay
          shy={this.props.shy}
          onClick={this.props.switchToPlayer}
        />
        <LibraryContainer
          shy={this.props.shy}
          focused={this.props.focused}
        >
          <LibraryList/>
          <LibraryEntryDetails>
            <LibraryOpener
              shy={this.props.shy}
              onClick={this.props.switchToLibrary}
            >
              <i className="fa fa-chevron-left"/>
              Back to library
            </LibraryOpener>


            <Btn onClick={this.props.switchToPlayer}>
              Go to player
            </Btn>

            I am details
            I am details
            I am details
            I am details
            I am details
            I am details
            I am details
            I am details
            I am details
            I am details
            I am details
            I am details
            I am details
            I am details
          </LibraryEntryDetails>
        </LibraryContainer>
      </div>
    );
  }
}

export default connect<LibraryMapStateProps, LibraryMapDispatchProps, LibraryOwnProps>(
  (state: StoreState) => ({
    library: state.library
  }),
  dispatch => ({
    selectEntry: (entryId: string) => dispatch(selectEntryAction(entryId))
  })
)(Library);
