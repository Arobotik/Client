import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from "react-router-dom"
import {createBrowserHistory} from 'history'
import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from "redux";
import {Provider} from 'react-redux';
import {rootReducer} from "./Redux/rootReducer";
import {syncHistoryWithStore} from 'react-router-redux';

import RouteSite from './RouteSite';

import * as serviceWorker from './serviceWorker';
import {loadState, saveState} from "./Redux/localStorage";
import {Main} from "./Styles";
const persistedState = loadState();
const store = createStore(rootReducer, persistedState, applyMiddleware(thunk));

store.subscribe(() => {
    saveState({
        user: store.getState().user,
        admin: store.getState().admin
    })
});

const hashHistory = createBrowserHistory();
const history = syncHistoryWithStore(hashHistory, store);

const router = (
    <Main>
        <Provider store={store}>
          <Router history={history}>
            <RouteSite />
          </Router>
        </Provider>
    </Main>
);

ReactDOM.render(
    router,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();