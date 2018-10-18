import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import createHistory from 'history/createBrowserHistory'
import { createStore, applyMiddleware } from 'redux'
import { ConnectedRouter as Router, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import { Route } from 'react-router-dom'
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './RootReducer'
import { enableBatching } from 'redux-batched-actions';
import { Provider } from 'react-redux';

const history = createHistory();
const rMiddleware = routerMiddleware(history);

let store = createStore(enableBatching(rootReducer), {}, composeWithDevTools(applyMiddleware(thunk, rMiddleware)));

ReactDOM.render(
  <Provider store={store}>
	<Router history={history}>
	  <Route path='/' component={App} />
	</Router>
  </Provider>, document.getElementById('root'));