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

const store = createStore(appReducers);

setStore(store);

ReactDom.render(
  <Provider store={store}>
    <Gui />
  </Provider>,
  document.getElementById('gui-mount')
);
