import styled from 'styled-components';

interface pc extends StyledProps {
  focused: boolean
}
export const PlayerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  
  background-color: ${(p:pc)=>p.theme.mainBgColor};
  background-image: url(https://i.imgur.com/RuRaNm9.jpg);
  color: ${(p:pc)=>p.theme.mainFgColor};
  
  filter: grayscale(${(p:pc)=> p.focused ? '0' : '.5'});
  will-change: filter;
  transition: filter .2s ease;
  
  z-index: 100;
`;