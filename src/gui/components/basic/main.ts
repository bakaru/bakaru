import styled from 'styled-components';

export interface ThemeInterface {
  mainBgColor: string;
  mainFgColor: string;
  contrastColor: string;
}

interface i {
  theme: ThemeInterface,
  [key: string]: any
}

export const PlayerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  
  background-color: ${(p:i)=>p.theme.mainBgColor};
  color: ${(p:i)=>p.theme.mainFgColor};
  
  z-index: 100;
`;

export const PlayerLibraryOverlay = styled.div`
  z-index: 199;
`;

interface lc extends i {
  shy: boolean,
  hidden: boolean
}
export const LibraryContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 0, .5);
  transform: translateX(${(p:lc)=> p.hidden ? '0%' : (p.shy ? '-50%' : '0%')});
  transition: transform .2s ease;
  
  z-index: 200;
`;

export const WindowOverlay = styled.div`
  z-index: 300;
`;
