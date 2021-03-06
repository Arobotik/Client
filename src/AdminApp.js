import React, { Component } from 'react';

import {
    Route,
    Switch,
    Redirect,
    withRouter
} from "react-router-dom"

import AdminLogin from './AdminLogin';
import AdminBook from './AdminBook';
import AdminBranches from './AdminBranches';
import AdminUserPageUpdate from "./AdminUserPageUpdate";
import AdminRequests from "./AdminRequests";

class Admin extends Component{
    render(){
        const { history } = this.props;
        return <div className={"Admin"}>
            <Switch>
                <Route history={history} path='/admin/login' component={AdminLogin} />
                <Route history={history} path='/admin/book' component={AdminBook} />
                <Route history={history} path='/admin/branches' component={AdminBranches} />
                <Route history={history} path='/admin/requests' component={AdminRequests} />
                <Route history={history} exact path='/admin/userpageupdate/:id' component={AdminUserPageUpdate} />
                <Redirect from='/admin/' to='/admin/login'/>
            </Switch>
        </div>;
    }
}

export default withRouter(Admin)