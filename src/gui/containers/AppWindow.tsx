import * as React from 'react';
import { connect } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import * as ui from 'gui/store/ducks/ui';

import WindowControls from 'gui/components/WindowControls';
import Library from 'gui/components/Library';
import Player from 'gui/components/Player';

const mainTheme = {
  mainBgColor: '#343a40',
  mainFgColor: '#e9ecef',
  contrastColor: 'hsl(345, 100%, 50%)'
};

const AppContainer = styled.div`
  --padding: 10px 16.8px;
  box-sizing: content-box;
  
  ::-webkit-scrollbar {
    width: 4px;
    background-color: transparent;
  }
  ::-webkit-scrollbar:horizontal {
    height: 2px;
  }
  ::-webkit-scrollbar-track {
    border-left: solid 1px #495057;
    background-color: #495057;
  
    &:horizontal {
      border-left: none;
      border-top: solid 1px #495057;
    }
  }
  ::-webkit-scrollbar-thumb {
    width: 2px;
    box-shadow: 1px 0 0 0 #495057 inset;
    background-color: #868e96;
  
    &:horizontal {
      box-shadow: 0 1px 0 0 #495057 inset;
    }
  }
  ::-webkit-scrollbar-button {
    width: 0;
    height: 0;
    display: none;
  }
  ::-webkit-scrollbar-corner {
    background-color: transparent;
  }
`;

interface AppWindowProps {
  ui: ui.State,
  switchToLibrary: Function,
  switchToPlayer: Function,
  switchToShyLibrary: Function
}

const AppWindow = (props: AppWindowProps) => (
  <ThemeProvider theme={mainTheme}>
    <AppContainer>
      <WindowControls
        visible={props.ui.library}
      />
      <Player
        focused={props.ui.player}
        switchToLibrary={props.switchToLibrary}
        switchToShyLibrary={props.switchToShyLibrary}
      />
      <Library
        shy={props.ui.shyLibrary}
        focused={props.ui.library}
        switchToPlayer={props.switchToPlayer}
        switchToLibrary={props.switchToLibrary}
        switchToShyLibrary={props.switchToShyLibrary}
      />
    </AppContainer>
  </ThemeProvider>
);

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
