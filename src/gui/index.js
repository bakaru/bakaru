require('./style');

import React from 'react'
import ReactDOM from 'react-dom'
import WindowControls from './components/WindowControls'
import Player from './components/Player'
import Library from './components/Library'
import { Provider } from 'react-redux'
import { connection } from 'shared/Backend'

import createStore from './store';

connection.then(() => {
  const store = createStore();

  ReactDOM.render(
    <Provider store={store}>
      <div>
        <WindowControls/>
        <Library/>
        <Player/>
      </div>
    </Provider>,
    document.getElementById('gui-mount')
  );
});
