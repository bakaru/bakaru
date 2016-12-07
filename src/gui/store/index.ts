import { createStore, combineReducers, applyMiddleware, Store } from 'redux';
import thunk from 'redux-thunk';
import reducers, { State } from './ducks';

export default function makeStore(): Store<State> {
  const middleware = applyMiddleware(thunk);
  const reducer = combineReducers(reducers);

  return <Store<State>>createStore(reducer, middleware);
}
