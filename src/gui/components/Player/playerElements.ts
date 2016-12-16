import styled from 'styled-components';

interface pc extends StyledProps {
  focused?: boolean,
  show?: boolean
}

const controlsHeight = '50px';

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

export const ShyLibrary = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  bottom: 0;
  width: 50px;
  color: transparent;
  background-color: transparent;
  user-select: none;
  cursor: default;
  
  transition: all .2s ease;
  
  z-index: 101;
  
  &:hover {
    color: ${(p:pc) => p.theme.mainFgColor};
    background-color: rgba(0, 0, 0, .5);
    
    &::after {
      opacity: 1;
    }
  }
  
  &>span {
    transform: rotate(-90deg);
    letter-spacing: 15px;
  }
  
  /*&::after {
    display: block;
    content: '';
    position: fixed;
    top: calc(50vh - 35px);
    left: 50px;
    width: 50px;
    height: 70px;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDUwIDcwIj4gIDxwb2x5Z29uIHBvaW50cz0iMCwwIDUwLDM1IDAsNzAiIHN0eWxlPSJmaWxsOnJnYmEoMCwwLDAsMC41KTsiIC8+PC9zdmc+);
    
    opacity: 0;
    transition: opacity .2s ease;
    pointer-events: none;
    
    z-index: 101;
  }*/
`;

export const ControlsWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(${controlsHeight} + 30px);
  
  z-index: 102;
  
  &:hover>div {
    transform: translateY(0);
  }
`;

export const Controls = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${controlsHeight};
  
  background-color: ${(p:pc) => p.theme.contrastColor};
  
  transform: translateY(${(p:pc) => p.show ? '0' : `${controlsHeight}`});
  transition: transform .2s ease;
  
  z-index: 103;
`;
