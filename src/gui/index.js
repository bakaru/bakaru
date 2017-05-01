require('./style');

import Inferno from 'inferno'
import { Provider } from 'inferno-redux'
import Player from './components/Player'

// import createStore from './store';
//
// const store = createStore();

Inferno.render(
  <Provider>
    <div className="test">
      Yay!
      <Player/>
    </div>
  </Provider>,
  document.getElementById('gui-mount')
);
