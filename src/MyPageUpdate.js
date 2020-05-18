import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Canvas from "./Canvas";
import {validateNewLoginData, validateNewUserData, validateConnection} from './validators';

class MyPageUpdate extends Component {
    state= {
        login: '',
        password: '',
    };

    async onGetAllBranches(){
        const response = await fetch('/getAllBranches');
        const body = await response.json();

        this.setState({branches: body.express});
    }

    imageChange(canvas){
        if (canvas.current !== null){
            canvas.current.changeImage(this.state.avatarPath);
        }
    };

    onPersonPageDataChange = async e =>{
        e.preventDefault();
        validateNewLoginData(this.state, this.state.oldLogin.toLowerCase() !== this.state.login.toLowerCase())
            .then(result => {
                switch (result){
                    case 0:
                        return true;
                    case 1:
                        alert('Password should contains only A-Z, a-z, 0-9 and at least one of each of them');
                        break;
                    case 2:
                        alert('Password should contains at least 8 and not more then 16 symbols');
                        break;
                    case 3:
                        alert('Login is incorrect');
                        break;
                    default:
                        alert('Login is already occupied')
                }
                return false;
            }).then((result) => {
            if (result === true)
                validateNewUserData(this.state).then(async result  =>  {
                    switch (result) {
                        case 0:
                            this.setState({avatar: this.canvasEditRef.current !== null ? this.canvasEditRef.current.toBlob() : null});
                            alert(this.state.branch);
                            await fetch('/registerOrChange', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    login: this.state.login.toLowerCase(),
                                    password: this.state.password,
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
                                    session: Cookies.get('sessionId'),
                                }),
                            });
                            alert('Successfully modified');
                            this.state.correctLogin = false;
                            this.setState({page: this.state.page - 2});
                            break;
                        case 1:
                            alert('Field Name must be filled');
                            break;
                        case 2:
                            alert('Work Phone must be correct work Number');
                            break;
                        case 3:
                            alert('Field Name must be correct private Number');
                            break;
                        case 4:
                            alert('If you want to fill more private Numbers, they must be correct');
                            break;
                        default:
                            alert('Incorrect Birth Date');
                            break;
                    }
                });
        });
    };

    loaded = false;

    makeUint8Array(data){
        let arr = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++ ) {
            arr[i] = data[i];
        }
        return arr;
    }

    async onGetMyPage(){
        const response = await fetch('/getMyPage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({session: Cookies.get('sessionId')}),
            });
        const body = await response.json();

        if (body.result){
            let avatar = body.avatar !== null && body.avatar !== '' && body.avatar !== undefined
                ? new Blob([this.makeUint8Array(body.avatar)], {type: 'image/png'})
                : '';
            this.setState({
                id: body.id,
                name: body.name,
                login: body.login,
                password: body.password,
                birthDate: body.birthDate,
                branch: body.branch,
                workPhone: body.workPhone,
                position: body.position,
                workPlace: body.workPlace,
                privatePhone1: body.privatePhone1,
                privatePhone2: body.privatePhone2,
                privatePhone3: body.privatePhone3,
                hideYear: body.hideYear,
                hidePhones: body.hidePhones,
                oldLogin: body.login,
                about: body.about,
                avatar: avatar,
                avatarPath: avatar !== '' ? URL.createObjectURL(avatar) : '',
            });
            this.imageChange(this.canvasEditRef)
        }
        else{
            Cookies.remove('userId');
            Cookies.remove('sessionId');
            window.location.assign('http://localhost:3000/app/login');
        }
    }

    canvasEditRef = React.createRef();

    render(){
        validateConnection();
        if (!this.loaded){
            this.onGetAllBranches();
            this.onGetMyPage();
            this.loaded = true;
        }
        if (Cookies.get('userId') !== undefined){
            return(
                <div className="PersonsChangePage">
                    <form onSubmit={this.onPersonPageDataChange}>
                        <h1>
                            <strong>Data changing:</strong>
                        </h1>
                        <p>
                            <strong>Login:</strong>
                        </p>
                        <input
                            type="text"
                            value={this.state.login}
                            onChange={e => this.setState({login: e.target.value})}
                        />
                        <p>
                            <strong>Password:</strong>
                        </p>
                        <input
                            type="text"
                            value={this.state.password}
                            onChange={e => this.setState({password: e.target.value})}
                        /><br/>
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
                            value={this.state.privatePhone2 === null ? '' : this.state.privatePhone2}
                            onChange={e => this.setState({privatePhone2: e.target.value})}
                        /><br/>
                        <input
                            type="text"
                            value={this.state.privatePhone3 === null ? '' : this.state.privatePhone3}
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
                        <p>
                            <select
                                defaultValue={this.state.branch !== '' && this.state.branch !== 'None'
                                    ? this.state.branch
                                    : ''
                                }
                                onChange={e => this.setState({branch: e.target.value})}
                            >
                                <option disabled>Choose branch...</option>
                                <option value={'None'} key={-1}>None</option>
                                {this.state.branches === [] || this.state.branches === null || this.state.branches === undefined
                                    ? ''
                                    : this.state.branches.map(item => {
                                        return <option value={item[1]} key={item[0]}>{item[1]}</option>
                                    })
                                }
                            </select>
                        </p>
                        <p>
                            <strong>Position:</strong>
                        </p>
                        <input
                            type="text"
                            value={this.state.position === null ? '' : this.state.position}
                            onChange={e => this.setState({position: e.target.value})}
                        />
                        <p>
                            <strong>Work Place:</strong>
                        </p>
                        <input
                            type="text"
                            value={this.state.workPlace === null ? '' : this.state.workPlace}
                            onChange={e => this.setState({workPlace: e.target.value})}
                        />
                        <p>
                            <strong>About:</strong>
                        </p>
                        <input
                            type="text"
                            value={this.state.about === null ? '' : this.state.about}
                            onChange={e => this.setState({about: e.target.value})}
                        /><br/>
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
                        <button onClick={e => this.imageChange(this.canvasEditRef)} type="button">Load</button><br/>
                        {
                            this.state.avatarPath === ''
                                ? <p>No avatar</p>
                                : <Canvas avatarPath={this.state.avatarPath} ref={this.canvasEditRef}/>
                        }
                        <button type="submit">Confirm</button>
                        <button onClick={() => window.location.assign('http://localhost:3000/app/mypage')} type="button">Back</button><br/>
                    </form>
                </div>
            )
        }
        else{
            window.location.assign('http://localhost:3000/app/login');
        }
    }
}

export default MyPageUpdate;