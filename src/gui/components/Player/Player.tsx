import * as React from 'react';
import { PlayerContainer } from './playerElements';

interface PlayerProps {
  switchToShyLibrary: Function,
  switchToLibrary: Function,

  focused?: boolean
}

export default class Player extends React.Component<PlayerProps, any> {
  render() {
    return (
      <PlayerContainer
        focused={this.props.focused}
        onClick={this.props.switchToShyLibrary}
      >
        <div
          style={{ position: 'relative', width: '100vw', height: '85vh' }}
        >
          <iframe
            src='https://gfycat.com/ifr/CleanOptimisticFlicker'
            frameBorder='0'
            scrolling='no'
            width='100%'
            height='100%'
            style={{ position: 'absolute', top: 0, left: 0 }}
            allowFullScreen/>
        </div>
      </PlayerContainer>
    );
  }
}
