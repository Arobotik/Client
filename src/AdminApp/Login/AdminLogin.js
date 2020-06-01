import React, { Component } from 'react';
import Cookies from 'js-cookie';
import LoginComponent from "../../Components/LoginComponent";
import {connect} from "react-redux";
import {adminLogin, onResetState} from "../../Redux/adminActions";
import {Button, Error} from "../../Styles";

class AdminLogin extends Component {
    state = {
        login: '',
        password: '',
        error: '',
    };

    onLogin = async e => {
        e.preventDefault();
        this.props.adminLogin(Cookies.get('login'), Cookies.get('password'));
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
                </form>
                {this.state.error !== ''
                    ? <Error>{this.state.error}</Error>
                    : ''
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    console.log(state);
    return {
        login: state.admin.login,
        password: state.admin.password,
        error: state.admin.error,
    }
};

const mapDispatchToProps = {
    onResetState,
    adminLogin
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminLogin);