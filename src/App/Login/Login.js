import React, { Component } from 'react';
import Cookies from 'js-cookie';
import LoginComponent from "../../Components/LoginComponent";
import {connect} from 'react-redux';
import {appLogin, onResetState} from "../../Redux/actions";
import {Button, Error} from "../../Styles";

class Login extends Component {
    state = {
        login: '',
        password: '',
        error: '',
    };

    onLogin = async e => {
        e.preventDefault();
        this.props.appLogin(Cookies.get('login'), Cookies.get('password'));
    };

    render() {
        this.props.onResetState();
        return (
            <div className="Login">
                <form onSubmit={this.onLogin}>
                    <h1>
                        <strong>Welcome</strong>
                    </h1>
                    <LoginComponent/>
                    <Button type="submit">Login</Button>
                    <Button onClick={() => window.location.assign('http://localhost:3000/app/register')}
                            type="button">Register
                    </Button>
                </form>
                {this.props.error !== ''
                    ? <Error>{this.props.error}</Error>
                    : ''
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    console.log(state);
    return {
        login: state.user.login,
        password: state.user.password,
        error: state.user.error,
    }
};

const mapDispatchToProps = {
    onResetState,
    appLogin
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);