require('./style');

import Inferno from 'inferno'
import Player from './components/Player'
import { Provider } from 'inferno-redux'
import { connection } from 'shared/Backend'

// import createStore from './store';
//
// const store = createStore();

connection.then(() => {
  Inferno.render(
    <Provider>
      <div className="test">
        Yay!
        <Player/>
      </div>
    </Provider>,
    document.getElementById('gui-mount')
  );
});
