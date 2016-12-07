import * as React from 'react';
import { LibraryContainer } from 'gui/components/basic/main';

interface LibraryProps {
  switchToShyLibrary: Function,
  switchToLibrary: Function,

  focused?: boolean,
  shy?: boolean
}

export default class Library extends React.Component<LibraryProps, any> {
  public defaultProps = {
    focused: false,
    shy: false
  };

  public state = {
    shy: true
  };

  render() {
    return (
      <LibraryContainer
        shy={this.props.shy}
        focused={this.props.focused}
        onClick={() => this.props.shy ? this.props.switchToLibrary() : this.props.switchToShyLibrary()}
      >
        Im a library!
      </LibraryContainer>
    );
  }
}
