import * as React from 'react';
import { PlayerContainer } from 'gui/components/basic/main';

interface PlayerProps {
  focused?: boolean
}

export default class Player extends React.Component<PlayerProps, any> {
  render() {
    return (
      <PlayerContainer focused={this.props.focused}>
        Player!!!
      </PlayerContainer>
    );
  }
}
