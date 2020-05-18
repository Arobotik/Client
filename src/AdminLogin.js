import React, { Component } from 'react';
import Cookies from 'js-cookie';
import LoginComponent from "./LoginComponent";

class AdminLogin extends Component {
    state= {
        login: '',
        password: '',
        error: '',
    };

    onLogin = async e => {
        e.preventDefault();
        const response = await fetch('/adminLoginPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login: Cookies.get('login'), password: Cookies.get('password') }),
        });
        const body = await response.json();

        if (body.logged){
            Cookies.set('sessionId', body.sessionId);
            window.location.assign('http://localhost:3000/admin/book');
            Cookies.remove('login');
            Cookies.remove('password');
        }
        else{
            this.setState({error: 'Check Login or Password'});
        }
    };

    render(){
        Cookies.remove('userId');
        Cookies.remove('sessionId');
        if (Cookies.get('sessionId') === undefined){
            return (
                <div className="Login">
                    <form onSubmit={this.onLogin}>
                        <h1>
                            <strong>Welcome</strong>
                        </h1>
                        <LoginComponent/>
                        <button type="submit">Login</button>
                    </form>
                    {this.state.error !== ''
                        ? <p style={{color: "red"}}>{this.state.error}</p>
                        :''
                    }
                </div>
            )
        }
        else{
            window.location.assign('http://localhost:3000/admin/book');
        }
    }
}

export default AdminLogin;