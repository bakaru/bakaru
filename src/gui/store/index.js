import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import modules, { attach } from './modules'

export default function makeStore() {
  const middleware = applyMiddleware(thunk);
  const reducer = combineReducers(modules);

  return attachStore(
    createStore(reducer, middleware)
  );
}

function attachStore(store) {
  attach(store);

  return store;
}
