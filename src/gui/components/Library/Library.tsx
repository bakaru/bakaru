import * as React from 'react';
import {
  LibraryContainer,
  PlayerLibraryOverlay,
  LibraryList,
  LibraryEntryDetails
} from './libraryElements';

interface LibraryProps {
  switchToShyLibrary: Function,
  switchToLibrary: Function,
  switchToPlayer: Function,

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
          onClick={() => this.props.shy ? this.props.switchToLibrary() : this.props.switchToShyLibrary()}
        >
          <LibraryList>
            I am list
            <div style={{ height: '1000vh' }}/>
          </LibraryList>
          <LibraryEntryDetails>
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
