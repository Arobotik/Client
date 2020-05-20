import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Canvas from "./Canvas";
import {validateNewLoginData, validateNewUserData, validateConnection} from './validators';
import {setUpdatedUserData, getMyPage, getBranches} from './fetches';
import InputElement from "react-input-mask";

class MyPageUpdate extends Component {
    state= {
        login: '',
        password: '',
        error: '',
    };

    async onGetAllBranches(){
        const body = await getBranches();

        this.setState({branches: body.express});
    }

    imageChange(canvas){
        if (canvas.current !== null){
            canvas.current.changeImage(this.state.avatarPath);
        }
    };

    changeInputHandler = e =>{
        e.persist();
        this.setState(prev => ({...prev, ...{
                [e.target.name]: e.target.value
            }}))
    };

    onPersonPageDataChange = async e =>{
        e.preventDefault();
        Cookies.set('login', this.state.login);
        Cookies.set('password', this.state.password);
        validateNewLoginData(this.state, this.state.oldLogin.toLowerCase() !== this.state.login.toLowerCase())
            .then(result => {
                switch (result){
                    case 0:
                        return true;
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
                return false;
            }).then((result) => {
            if (result === true)
                validateNewUserData(this.state).then(async result  =>  {
                    switch (result) {
                        case 0:
                            this.setState({avatar: this.canvasEditRef.current !== null ? this.canvasEditRef.current.toBlob() : null});
                            alert(this.state.branch);
                            await setUpdatedUserData(this.state);
                            alert('Successfully modified');
                            this.state.correctLogin = false;
                            this.setState({page: this.state.page - 2});
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
        });
        Cookies.remove('login');
        Cookies.remove('password');
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
        const body = await getMyPage();

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
                            value={this.state.login ? this.state.login : ''}
                            name={"login"}
                            onChange={this.changeInputHandler}
                        />
                        <p>
                            <strong>Password:</strong>
                        </p>
                        <input
                            type="text"
                            value={this.state.password ? this.state.password : ''}
                            name={"password"}
                            onChange={this.changeInputHandler}
                        /><br/>
                        <p>
                            <strong>*Name:</strong>
                        </p>
                        <input
                            type="text"
                            value={this.state.name ? this.state.name : ''}
                            name={"name"}
                            onChange={this.changeInputHandler}
                        />
                        <p>
                            <strong>*Birth Date:</strong>
                        </p>
                        <input
                            type="date"
                            value={this.state.birthDate ? this.state.birthDate : ''}
                            name={"birthDate"}
                            onChange={this.changeInputHandler}
                        />
                        <input
                            type="checkbox"
                            checked={this.state.hideYear ? this.state.login : false}
                            onChange={e => this.setState({hideYear: e.target.checked})}
                        />Hide Year<br/>
                        <p>
                            <strong>*Work Phone:</strong>
                        </p>
                        <InputElement
                            mask="+7(999)999-99-99"
                            value={this.state.workPhone ? this.state.workPhone : ''}
                            name={"workPhone"}
                            onChange={this.changeInputHandler}
                            placeholder="Work Phone" ref="workPhone"
                        />
                        <p>
                            <strong>*Private Phone:</strong>
                        </p>
                        <InputElement
                            mask="+7(999)999-99-99"
                            value={this.state.privatePhone1 ? this.state.privatePhone1 : ''}
                            name={"privatePhone1"}
                            onChange={this.changeInputHandler}
                            placeholder="Private Phone 1" ref="privatePhone1"
                        />
                        <p>
                            <strong>Additional private Phones:</strong>
                        </p>
                        <InputElement
                            mask="+7(999)999-99-99"
                            value={this.state.privatePhone2 ? this.state.privatePhone2 : ''}
                            name={"privatePhone2"}
                            onChange={this.changeInputHandler}
                            placeholder="Private Phone 2" ref="privatePhone2"
                        /><br/>
                        <InputElement
                            mask="+7(999)999-99-99"
                            value={this.state.privatePhone3 ? this.state.privatePhone3 : ''}
                            name={"privatePhone3"}
                            onChange={this.changeInputHandler}
                            placeholder="Private Phone 3" ref="privatePhone3"
                        />
                        <input
                            type="checkbox"
                            checked={this.state.hidePhones ? this.state.hidePhones : false}
                            onChange={e => this.setState({hidePhones: e.target.checked})}
                        />Hide Phones<br/>
                        <p>
                            <strong>Branch:</strong>
                        </p>
                        <p>
                            <select
                                value={this.state.branch !== '' && this.state.branch !== 'None'
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
                            value={this.state.position === null ? '' : this.state.position ? this.state.position : ''}
                            name={"position"}
                            onChange={this.changeInputHandler}
                        />
                        <p>
                            <strong>Work Place:</strong>
                        </p>
                        <input
                            type="text"
                            value={this.state.workPlace === null ? '' : this.state.workPlace ? this.state.workPlace : ''}
                            name={"workPlace"}
                            onChange={this.changeInputHandler}
                        />
                        <p>
                            <strong>About:</strong>
                        </p>
                        <input
                            type="text"
                            value={this.state.about === null ? '' : this.state.about ? this.state.about : ''}
                            name={"about"}
                            onChange={this.changeInputHandler}
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
                    {this.state.error !== ''
                        ? <p style={{color: "red"}}>{this.state.error}</p>
                        :''
                    }
                </div>
            )
        }
        else{
            window.location.assign('http://localhost:3000/app/login');
        }
    }
}

export default MyPageUpdate;