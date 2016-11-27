require('font-awesome/css/font-awesome.css');

import * as socketIO from 'socket.io-client';

const io = socketIO();

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { AppWindow } from './containers/AppWindow';

// const wcjs = window.require(getQueryVariable('wcjsPath'));

ReactDom.render(
  <AppWindow/>,
  document.getElementById('gui-mount')
);

function getQueryVariable(variable: string) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  console.log('Query variable %s not found', variable);
}
