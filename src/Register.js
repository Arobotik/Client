import React from "react";
import Cookies from 'js-cookie';
import Canvas from "./Canvas";
import LoginComponent from "./LoginComponent";
import {validateNewLoginData, validateNewUserData} from './validators';

class Register extends React.Component {
    state = {login: '', password: '', error: '', page: 1};

    onLoginRegister = async e => {
        e.preventDefault();
        validateNewLoginData(this.state, true).then(result => {
            switch (result){
                case 0:
                    this.setState({
                        name: '',
                        birthDate: '',
                        workPhone: '',
                        branch: '',
                        position: '',
                        workPlace: '',
                        privatePhone1: '',
                        privatePhone2: '',
                        privatePhone3: '',
                        hideYear: false,
                        hidePhones: false,
                        about: '',
                        avatar: '',
                        avatarPath: '',
                        filter: '',
                        id: null,
                        error: '',
                        page: 2});
                    break;
                case 1:
                    this.setState({error: 'Password should contains only A-Z, a-z, 0-9 and at least one of each of them'});
                    break;
                case 2:
                    this.setState({error: 'Password should contains at least 8 and not more then 16 symbols'});
                    break;
                case 3:
                    this.setState({error: 'Login is incorrect'});
                    break;
                default:
                    this.setState({error: 'Login is already occupied'});
            }
        });
    };

    onDataRegister = async e => {
        e.preventDefault();
        validateNewUserData(this.state).then(result => {
            switch(result){
                case 0:
                    let avatar = this.canvasRef.current !== null ? this.canvasRef.current.toBlob() : null;
                    this.setState({page: 3, avatar: avatar});
                    break;
                case 1:
                    this.setState({error: 'Field Name must be filled'});
                    break;
                case 2:
                    this.setState({error: 'Work Phone must be correct work Number'});
                    break;
                case 3:
                    this.setState({error: 'Field Number must be correct private Number'});
                    break;
                case 4:
                    this.setState({error: 'If you want to fill more private Numbers, they must be correct'});
                    break;
                default:
                    this.setState({error: 'Incorrect Birth Date'});
                    break;
            }
        });
    };

    canvasRef = React.createRef();


    imageChange(canvas){
        if (canvas.current !== null){
            canvas.current.changeImage(this.state.avatarPath);
        }
    };

    onNewUserRegister = async e =>{
        e.preventDefault();
        await fetch('/registerOrChange', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: Cookies.get('login'),
                password: Cookies.get('password'),
                name: this.state.name,
                birthDate: this.state.birthDate,
                workPhone: this.state.workPhone,
                privatePhone1: this.state.privatePhone1,
                privatePhone2: this.state.privatePhone1,
                privatePhone3: this.state.privatePhone1,
                branch: this.state.branch,
                position: this.state.position,
                workPlace: this.state.workPlace,
                hideYear: this.state.hideYear,
                hidePhones: this.state.hidePhones,
                about: this.state.about,
                avatar: this.state.avatar,
                len: this.state.avatar.length,
            }),
        });
        window.location.assign('http://localhost:3000/app/login')
    };

    render(){
        console.log(this.state.page);
        if (this.state.page === 1) {
            return (
                <div className="RegisterState1">
                    <form onSubmit={this.onLoginRegister}>
                        <h1>
                            <strong>Registration:</strong>
                        </h1>
                        <LoginComponent/>
                        <button type="submit">Continue</button>
                        <button onClick={() => window.location.assign('http://localhost:3000/app/login')} type="button">Back</button>
                    </form>
                    {this.state.error !== ''
                        ? <p style={{color: "red"}}>{this.state.error}</p>
                        :''
                    }
                </div>
            );
        } else if (this.state.page === 2) {
            return (
                <div className="RegisterState2">
                    <form onSubmit={this.onDataRegister}>

                        <p>
                            <strong>*Name:</strong>
                        </p>
                        <input
                            type="text"
                            value={this.state.name}
                            onChange={e => this.setState({name: e.target.value})}
                        />
                        <p>
                            <strong>*Birth Date:</strong>
                        </p>
                        <input
                            type="date"
                            value={this.state.birthDate}
                            onChange={e => this.setState({birthDate: e.target.value})}
                        />
                        <input
                            type="checkbox"
                            checked={this.state.hideYear}
                            onChange={e => this.setState({hideYear: e.target.checked})}
                        />Hide Year<br/>
                        <p>
                            <strong>*Work Phone:</strong>
                        </p>
                        <input
                            type="text"
                            value={this.state.workPhone}
                            onChange={e => this.setState({workPhone: e.target.value})}
                        />
                        <p>
                            <strong>*Private Phone:</strong>
                        </p>
                        <input
                            type="text"
                            value={this.state.privatePhone1}
                            onChange={e => this.setState({privatePhone1: e.target.value})}
                        />
                        <p>
                            <strong>Additional private Phones:</strong>
                        </p>
                        <input
                            type="text"
                            value={this.state.privatePhone2}
                            onChange={e => this.setState({privatePhone2: e.target.value})}
                        /><br/>
                        <input
                            type="text"
                            value={this.state.privatePhone3}
                            onChange={e => this.setState({privatePhone3: e.target.value})}
                        />
                        <input
                            type="checkbox"
                            checked={this.state.hidePhones}
                            onChange={e => this.setState({hidePhones: e.target.checked})}
                        />Hide Phones<br/>
                        <p>
                            <strong>Branch:</strong>
                        </p>
                        <input
                            type="text"
                            value={this.state.branch}
                            onChange={e => this.setState({branch: e.target.value})}
                        />
                        <p>
                            <strong>Position:</strong>
                        </p>
                        <input
                            type="text"
                            value={this.state.position}
                            onChange={e => this.setState({position: e.target.value})}
                        />
                        <p>
                            <strong>Work Place:</strong>
                        </p>
                        <input
                            type="text"
                            value={this.state.workPlace}
                            onChange={e => this.setState({workPlace: e.target.value})}
                        />
                        <p>
                            <strong>About:</strong>
                        </p>
                        <input
                            type="text"
                            value={this.state.about}
                            onChange={e => this.setState({about: e.target.value})}
                        />
                        <p>
                            <strong>Avatar:</strong>
                        </p>
                        <input
                            type="file"
                            id={"avatar"}
                            onChange={e => {
                                this.setState({avatar: e.target.files[0], avatarPath: URL.createObjectURL(e.target.files[0])});
                            }}
                        />
                        <button onClick={e => this.imageChange(this.canvasRef)} type="button">Load</button><br/>
                        {
                            this.state.avatarPath === ''
                                ? <p>No avatar</p>
                                : <Canvas avatarPath={this.state.avatarPath} ref={this.canvasRef}/>
                        }
                        <button type="submit">Continue</button>
                        <button onClick={() => this.setState({page: this.state.page - 1})} type="button">Back</button>
                    </form>
                    {this.state.error !== ''
                        ? <p style={{color: "red"}}>{this.state.error}</p>
                        :''
                    }
                </div>
            );
        } else if (this.state.page === 3) {
            return (
                <div className="RegisterState3">
                    <form onSubmit={this.onNewUserRegister}>
                        <p>
                            <strong>Are you sure?</strong>
                        </p>
                        <button type="submit">Continue</button>
                        <button onClick={() => this.setState({page: this.state.page - 1})} type="button">Back</button>
                    </form>
                </div>
            )
        }
    }
}

export default Register;