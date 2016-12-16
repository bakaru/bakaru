import * as React from 'react';
import {
  LibraryContainer,
  PlayerLibraryOverlay,
  LibraryList,
  LibraryEntryDetails,
  LibraryOpener
} from './libraryElements';

interface LibraryProps {
  switchToShyLibrary: (() => void),
  switchToLibrary: (() => void),
  switchToPlayer: (() => void),

  focused?: boolean,
  shy?: boolean
}

export default class Library extends React.Component<LibraryProps, any> {
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
          <LibraryList>
            I am list
            <div style={{ height: '1000vh' }}/>
          </LibraryList>
          <LibraryEntryDetails>
            <LibraryOpener
              shy={this.props.shy}
              onClick={this.props.switchToLibrary}
            >
              <i className="fa fa-long-arrow-left"/>
              Back to library
            </LibraryOpener>


            <button onClick={this.props.switchToPlayer}>
              Go to player
            </button>

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
