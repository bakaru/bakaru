import * as React from 'react';
import { MorphReplace } from 'react-svg-morph';
import { easeInCubic } from 'react-svg-morph/lib/utils/easing';

import {
  PlayerContainer,
  ShyLibrary,
  ControlsWrapper,
  Controls
} from './playerElements';

interface PlayerProps {
  switchToShyLibrary: Function,
  switchToLibrary: Function,

  focused?: boolean
}

const playIcon = (
  <svg
    key="play"
    viewBox="0 0 36 36"
  >
    <path fill="black" d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z"/>
  </svg>
);

const pauseIcon = (
  <svg
    key="pause"
    width={26}
    height={26}
    viewBox="0 0 36 36"
  >
    <path fill="black" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"/>
  </svg>
);

export default class Player extends React.Component<PlayerProps, any> {
  public state = {
    ya: false
  };

  render() {
    const click = () => {
      console.log('Click');
      this.setState({ ya: !this.state.ya });
    };

    return (
      <PlayerContainer
        focused={this.props.focused}
      >
        <ShyLibrary onClick={this.props.switchToShyLibrary}>
          <span>LIBRARY</span>
        </ShyLibrary>
        <ControlsWrapper>
          <Controls>
            Yay
          </Controls>
        </ControlsWrapper>

        <div style={{ margin: '100px' }}>
          <button onClick={click}>
            <MorphReplace
              easing={easeInCubic}
              duration={200}
              rotation="none"
            >
              {this.state.ya ? playIcon : pauseIcon}
            </MorphReplace>
          </button>
        </div>
      </PlayerContainer>
    );
  }
}
