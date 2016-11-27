import * as React from 'react';
import styled from 'styled-components';

const AppContainer = styled.h1`
  color: red
`;

export class AppWindow extends React.Component<any, any> {
  render() {
    return (
      <AppContainer>
        Yay!!!
      </AppContainer>
    );
  }
}
