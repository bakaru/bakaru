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
  mainBorderColor: '#495057',
  contrastColor: 'hsl(345, 100%, 50%)',
  highlightColor: '#212529',

  clr0: '#f8f9fa',
  clr1: '#f1f3f5',
  clr2: '#e9ecef',
  clr3: '#dee2e6',
  clr4: '#ced4da',
  clr5: '#adb5bd',
  clr6: '#868e96',
  clr7: '#495057',
  clr8: '#343a40',
  clr9: '#212529',

  libraryListWidth: '60vw',
  libraryDetailsWidth: '40vw',
};

interface ac extends StyledProps {}
const AppContainer = styled.div`
  --padding: 10px 16.8px;
  box-sizing: border-box;
  user-select: none;
  cursor: default;
  
  ::-webkit-scrollbar {
    width: 4px;
    background-color: transparent;
  }
  ::-webkit-scrollbar:horizontal {
    height: 2px;
  }
  ::-webkit-scrollbar-track {
    border-left: solid 1px ${(p:ac) => p.theme.mainBorderColor};
    background-color: ${(p:ac) => p.theme.mainBgColor};
  
    &:horizontal {
      border-left: none;
      border-top: solid 1px ${(p:ac) => p.theme.mainBorderColor};
    }
  }
  ::-webkit-scrollbar-thumb {
    width: 2px;
    box-shadow: 1px 0 0 0 ${(p:ac) => p.theme.mainBorderColor} inset;
    background-color: ${(p:ac) => p.theme.mainBgColor};
  
    &:horizontal {
      box-shadow: 0 1px 0 0 ${(p:ac) => p.theme.mainBorderColor} inset;
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
  switchToLibrary: (() => void),
  switchToPlayer: (() => void),
  switchToShyLibrary: (() => void)
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
