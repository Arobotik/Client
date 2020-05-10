import React, { Component } from 'react';

import {
    Route,
    Switch,
    Redirect,
    withRouter
} from "react-router-dom"

import App from './App';
import AdminApp from './AdminApp';

class RouteSite extends Component {
    render() {
        const { history } = this.props;

        return (
            <div className="Route">
                <Switch>
                    <Route history={history} path='/app' component={App} />
                    <Route history={history} path='/admin' component={AdminApp} />
                    <Redirect from='/' to='/app'/>
                </Switch>
            </div>
        );
    }
}

export default withRouter(RouteSite)