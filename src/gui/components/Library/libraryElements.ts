import styled from 'styled-components';
import { truncate } from 'gui/utils/style';

interface lc extends StyledProps {
  shy: boolean,
  focused: boolean
}

export const PlayerLibraryOverlay = styled.div`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(52, 58, 64, .5);
  
  pointer-events: ${(p:lc) => p.shy ? 'inherit' : 'none'};
  opacity: ${(p:lc) => p.shy ? '1' : '0'};
  transition: opacity .2s ease;
  
  z-index: 199;
`;

export const LibraryContainer = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${(p:lc) => p.theme.mainBgColor};
  color: ${(p:lc)=>p.theme.mainFgColor};
  box-shadow: 0 0 30px 5px rgba(0, 0, 0, ${(p:lc)=> p.shy ? '.8' : '0'});
  
  transform: translateX(${(p:lc)=> p.focused ? '0vw' : (p.shy ? '-60vw' : '-100vw')});
  transition: all .2s ease;
  
  z-index: 200;
`;

export const LibraryList = styled.div`
  width: 60vw;
  height: 100vh;
  margin-top: 32px;
  overflow-y: scroll;
`;

export const LibraryEntryDetails = styled.div`
  width: 40vw;
  height: 100vh;
  overflow-y: scroll;
`;

export const LibraryOpener = styled.div`
  height: 32px;
  box-shadow: 0 1px 0 #495057;
  background-color: transparent;
  padding: 3px 16.8px;
  color: ${(p:lc) => p.theme.contrastColor};
  opacity: ${(p:lc) => p.shy ? '1' : '0'};
  
  transition: all .2s ease;
  
  &>i {
    margin-right: 16.8px;
  }
  
  &:hover {
    background-color: #495057;
  }
`;
