import styled from 'styled-components';
import { truncate } from 'gui/utils/style';

interface lp extends StyledProps {
  width?: number
}

export const Container = styled.div`
  
`;

export const Item = styled.div`
  position: relative;
  overflow-x: hidden;
  padding: 10px 16.8px 13px 16.8px;
  border-bottom: solid 1px ${(p:lp) => p.theme.mainBorderColor};
  
  &:hover {
    background-color: ${(p:lp) => p.theme.highlightColor};
  }
`;

export const Title = styled.div`
  ${(p:lp) => truncate(`calc(${p.theme.libraryListWidth} - 33.6px - 80px)`)}
  font-size: 21px;
  line-height: 1;
`;

export const Details = styled.div`
  margin-top: 8px;
  color: ${(p:lp) => p.theme.clr5};
  font-size: 11px;
`;

export const Detail = styled.div`
  display: inline-block;
  border-radius: 2px;
  padding: 2px 5px 3px 5px;
  line-height: 1;
  box-shadow: 0 0 0 1px ${(p:lp) => p.theme.clr6};
`;

export const Counter = styled.div`
  position: absolute;
  right: 16.8px;
  top: calc(50% - 15px);
  width: 80px;
  text-align: right;
  font-size: 30px;
  line-height: 1;
  color: ${(p:lp) => p.theme.clr7};
`;

export const Progress = styled.div`
  position: absolute;
  bottom: 0;
  left: -3px;
  height: 3px;
  width: calc(${(p:lp) => p.width}% + 6px);
  background-color: ${(p:lp) => p.theme.mainBorderColor};
  transform: skewX(45deg);
  transition: width .2s ease;
`;
