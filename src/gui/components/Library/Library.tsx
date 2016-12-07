import * as React from 'react';
import { LibraryContainer } from 'gui/components/common';

interface LibraryProps {
  focused?: boolean
}

export default class Library extends React.Component<LibraryProps, any> {
  public defaultProps = {
    focused: false
  };

  render() {
    return (
      <LibraryContainer focused={this.props.focused}>
        Im a library!
      </LibraryContainer>
    );
  }
}
