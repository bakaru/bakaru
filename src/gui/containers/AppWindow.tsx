import * as React from 'react';
import { connect } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import * as ui from 'gui/store/ducks/ui';

import Library from 'gui/components/Library';
import Player from 'gui/components/Player';

const mainTheme = {
  mainBgColor: '#333',
  mainFgColor: '#ddd',
  contrastColor: 'hsl(345, 100%, 50%)'
};

interface AppWindowProps {
  ui: ui.State,
  switchToLibrary: Function,
  switchToPlayer: Function,
  switchToShyLibrary: Function
}
function AppWindow(props: AppWindowProps) {
  return (
    <ThemeProvider theme={mainTheme}>
      <div>
        <Player focused={props.ui.player}/>
        <Library
          shy={props.ui.shyLibrary}
          focused={props.ui.library}
          switchToLibrary={props.switchToLibrary}
          switchToShyLibrary={props.switchToShyLibrary}
        />
      </div>
    </ThemeProvider>
  );
}

export default connect(
  state => ({
    ui: state.ui
  }),
  dispatch => ({
    switchToLibrary: () => dispatch(ui.switchToLibrary()),
    switchToPlayer: () => dispatch(ui.switchToPlayer()),
    switchToShyLibrary: () => dispatch(ui.switchToShyLibrary())
  })
)(AppWindow)
