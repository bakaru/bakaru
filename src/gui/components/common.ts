import styled from 'styled-components';

interface i extends StyledProps {}

export const Btn = styled.button`
  background-color: transparent;
  border-radius: 3px;
  border: none;
  color: ${(p:i) => p.theme.contrastColor};
  box-shadow: 0 0 0 1px ${(p:i) => p.theme.contrastColor};
  padding: 10 16.8px;
  line-height: 1;
  outline: none;
  
  &:hover {
    background-color: ${(p:i) => p.theme.contrastColor};
    color: ${(p:i) => p.theme.mainFgColor};
  }
  
  & svg {
    fill: currentColor;
  }
`;
