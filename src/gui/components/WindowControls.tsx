import * as React from 'react';
import styled from 'styled-components';

const buttonWidth = 46;
const buttonHeight = 32;

interface WindowControlsProps {
  visible?: boolean
}

interface hp extends StyledProps {
  visible: boolean
}
const Dragger = styled.div`
  -webkit-app-region: drag;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: ${buttonHeight}px;
  
  padding: 0 0 ${(p:hp) => p.visible ? '0' : `${50 - buttonHeight}px`} 0;
  
  background-size: 100% ${(p:hp) => p.visible ? buttonHeight : 0}px;
  background-image: linear-gradient(90deg, hsl(345, 100%, 50%), hsl(345, 100%, 40%));
  background-repeat: no-repeat;
  transition: all .2s ease;
  
  &:hover>div {
    opacity: 1;
  }
  
  z-index: 900;
`;
const Heading = styled.div`
  display: ${(p:hp) => p.visible ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  height: ${buttonHeight}px;
  width: 150px;
  color: ${(p:hp) => p.theme.mainFgColor}
  padding-left: 5px;
  font-size: 20px;
  line-height: ${buttonHeight}px;
  font-weight: 400;
`;

interface wp extends StyledProps {
  visible: boolean
}
const Wrapper = styled.div`
  -webkit-app-region: no-drag;
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  width: ${buttonWidth * 3}px;
  opacity: ${(p:wp) => p.visible ? '1' : '0'};
  transition: opacity .2s ease;
`;

const Button = styled.button`
  display: block;
  border: none;
  height: ${buttonHeight}px;
  width: ${buttonWidth}px;
  background-color: transparent;
  color: ${(p:wp) => p.theme.mainFgColor};
  transition: all .2s ease;
  outline: none;
  
  &:hover {
    background-color: ${(p:wp) => p.theme.mainFgColor};
    color: ${(p:wp) => p.theme.contrastColor};
  }
`;

const Icon = styled.svg`
  width: 10px;
  height: 10px;
  fill: currentColor;
  shape-rendering: crispEdges;
`;

const iconMaximize = 'M0,0v10.1h10.2V0H0z M9.2,9.2H1.1V1h8.1V9.2z';
const iconRestore = 'M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z';

export default function WindowControls(props: WindowControlsProps) {
  return (
    <Dragger visible={props.visible}>
      <Heading visible={props.visible}>
        カ
      </Heading>
      <Wrapper visible={props.visible}>
        <Button>
          <Icon x="0px" y="0px" viewBox="0 0 10.2 1">
            <rect width="10.2" height="2" />
          </Icon>
        </Button>
        <Button>
          <Icon x="0px" y="0px" viewBox="0 0 10.2 10.1">
            <path
              d={iconMaximize}
            />
          </Icon>
        </Button>
        <Button onClick={window.close}>
          <Icon x="0px" y="0px" viewBox="0 0 10.2 10.2">
            <polygon
              points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1 "
            />
          </Icon>
        </Button>
      </Wrapper>
    </Dragger>
  );
}
