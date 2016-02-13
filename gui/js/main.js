require('font-awesome/css/font-awesome.css');
require('../styles/font.css');
require('../styles/main.scss');

import React from 'react';
import ReactDom from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import appReducers from './reducers';
import { setStore } from 'ipc';

import Gui from './containers/Gui';

const wcjs = window.require(getQueryVariable('wcjsPath'));

const store = createStore(appReducers);

setStore(store);

ReactDom.render(
  <Provider store={store}>
    <Gui wcjs={ wcjs } />
  </Provider>,
  document.getElementById('gui-mount')
);

function getQueryVariable(variable) {
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
