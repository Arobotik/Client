import React from "react";
import Cookies from 'js-cookie';
import {Input} from "../Styles";

class LoginComponent extends React.Component {
    state = {login: '', password: ''};

    render(){
        return(
            <div className="Login">
                    <p>
                        <strong>Login:</strong>
                    </p>
                    <Input
                        type="text"
                        value={this.state.login}
                        onChange={e => {this.setState({login: e.target.value}); Cookies.set('login', e.target.value)}}
                    />
                    <p>
                        <strong>Password:</strong>
                    </p>
                    <Input
                        type="password"
                        value={this.state.password}
                        onChange={e => {this.setState({password: e.target.value}); Cookies.set('password', e.target.value)}}
                    /><br/>
            </div>
        )
    }
}

export default LoginComponent;