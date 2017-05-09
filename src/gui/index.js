require('./style');

import Inferno from 'inferno'
import WindowControls from './components/WindowControls'
import Player from './components/Player'
import Library from './components/Library'
import { Provider } from 'inferno-redux'
import { connection } from 'shared/Backend'

import createStore from './store';

connection.then(() => {
  const store = createStore();

  Inferno.render(
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
