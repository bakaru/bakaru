require('./styles/main.scss');

import React, { Component } from 'react';
import ReactDom from 'react-dom';

class Gui extends Component {
  constructor() {
    super()
  }

  render () {
    return (
      <gui>
        <header>BAKARU</header>
        Hi there :)
      </gui>
    );
  }
}

ReactDom.render(<Gui />, document.getElementById('gui-mount'));
