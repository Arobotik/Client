import React, { Component } from 'react';
import Cookies from 'js-cookie';
import LoginComponent from "./LoginComponent";

class Login extends Component {
    state= {
        login: '',
        password: '',
        error: '',
    };

    onLogin = async e => {
        e.preventDefault();
        if(/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(Cookies.get('login')) &&
            /([a-z]+[A-Z]+[0-9]+|[a-z]+[0-9]+[A-Z]+|[A-Z]+[a-z]+[0-9]+|[A-Z]+[0-9]+[a-z]+|[0-9]+[a-z]+[A-Z]+|[0-9]+[A-Z]+[a-z]+)/.test(Cookies.get('password'))
        ) {
            const response = await fetch('/loginPost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({login: Cookies.get('login'), password: Cookies.get('password')}),
            });
            const body = await response.json();

            if (body.logged) {
                Cookies.set('userId', body.id);
                Cookies.set('sessionId', body.sessionId);
                window.location.assign('http://localhost:3000/app/book');
            } else {
                this.setState({error: 'Incorrect Login or Password'});
            }
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
            return (
                <div className="Login">
                    <form onSubmit={this.onLogin}>
                        <h1>
                            <strong>Welcome</strong>
                        </h1>
                        <LoginComponent/>
                        <button type="submit">Login</button>
                        <button onClick={() => window.location.assign('http://localhost:3000/app/register')} type="button">Register</button>
                    </form>
                    {this.state.error !== ''
                        ? <p style={{color: "red"}}>{this.state.error}</p>
                        :''
                    }
                </div>
            )
        }
}

export default Login;