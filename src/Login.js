import React, { Component } from 'react';
import Cookies from 'js-cookie';
import LoginComponent from "./LoginComponent";
import {login} from './fetches';
import {validateLogin} from "./validators";

class Login extends Component {
    state= {
        login: '',
        password: '',
        error: '',
    };

    onLogin = async e => {
        e.preventDefault();
        if(validateLogin())
        {
            const body = await login();

            if (body.result === true) {
                Cookies.set('userId', body.id);
                Cookies.set('sessionId', body.sessionId);
                window.location.assign('http://localhost:3000/app/book');
                Cookies.remove('login');
                Cookies.remove('password');
            } else {
                this.setState({error: 'Incorrect Login or Password'});
            }
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