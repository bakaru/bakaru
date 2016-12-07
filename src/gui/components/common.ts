import styled from 'styled-components';

export interface ThemeInterface {
  mainBgColor: string;
  mainFgColor: string;
  contrastColor: string;
}

type i = {
  theme: ThemeInterface,
  [key: string]: any
}

export const test = styled('test')`
  yay: true
`;

export const PlayerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  
  background-color: ${(p:i)=>p.theme.mainFgColor};
  color: ${(p:i)=>p.theme.mainFgColor}
`;

export const LibraryContainer = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
`;
