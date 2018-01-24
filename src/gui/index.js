require('./style');

import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import WindowControls from './components/WindowControls'
import Player from './components/Player/Player'
import Library from './components/Library'
import { Provider } from 'react-redux'
import { connection } from 'shared/Backend'

import createStore from 'shared/store';

connection.then(() => {
  const store = createStore();

  ReactDOM.render(
    <Provider store={store}>
      <Fragment>
        <WindowControls/>
        <Library/>
        <Player/>
      </Fragment>
    </Provider>,
    document.getElementById('gui-mount')
  );
});
