import React, { Component } from 'react';

import {
    Route,
    Switch,
    Redirect,
    withRouter
} from "react-router-dom"

import Login from './Login/Login';
import Book from './Book/Book';
import MyPage from './MyPage/MyPage';
import MyPageUpdate from './MyPageUpdate/MyPageUpdate';
import Page from './Page/Page';
import Register from './Register/Register';

class App extends Component{
    render(){
        const { history } = this.props;
        return <div className={"App"}>
            <Switch>
                <Route history={history} path='/app/login' component={Login} />
                <Route history={history} path='/app/book' component={Book} />
                <Route history={history} path='/app/mypage' component={MyPage} />
                <Route history={history} path='/app/mypageupdate' component={MyPageUpdate} />
                <Route history={history} path='/app/register' component={Register} />
                <Route history={history} exact path='/app/page/:id' component={Page} />
                <Redirect from='/app' to='/app/login'/>
            </Switch>
        </div>;
    }
}

export default withRouter(App)