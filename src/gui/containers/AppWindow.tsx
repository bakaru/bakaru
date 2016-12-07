import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import Library from 'gui/components/Library';
import Player from 'gui/components/Player';

const mainTheme = {
  mainBgColor: '#333',
  mainFgColor: '#ddd',
  contrastColor: 'hsl(345, 100%, 50%)'
};

export default class AppWindow extends React.Component<any, any> {
  public state = {
    focus: 'player'
  };

  render() {
    const { focus } = this.state;

    return (
      <ThemeProvider theme={mainTheme}>
        <div>
          <Player focused={focus === 'player'}/>
          <Library focused={focus === 'library'}/>
        </div>
      </ThemeProvider>
    );
  }
}
