import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Canvas from "./Canvas";
import {validateAdminConnection} from './validators';

class AdminUserPageUpdate extends Component {
    state = {userId: -1,};

    componentDidMount() {
        this.setState({id: this.props.match.params.id,});
    }

    async onUserDataGet(){
        const response = await fetch('/getMyPage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: this.state.id, session: Cookies.get('sessionId'),}),
        });
        const body = await response.json();
        let avatar = body.avatar !== null && body.avatar !== '' && body.avatar !== undefined
            ? new Blob([this.makeUint8Array(body.avatar)], {type: 'image/png'})
            : '';
        this.setState({
            login: body.login,
            password: body.password,
            name: body.name,
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
            about: body.about,
            deleted: body.deleted,
            avatar: avatar,
            avatarPath: avatar !== '' ? URL.createObjectURL(avatar) : '',
            thisUserLogin: body.login,
            thisUserPassword: body.password
        });
        this.loaded = true;
    };

    makeUint8Array(data){
        let arr = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++ ) {
            arr[i] = data[i];
        }
        return arr;
    }

    onPersonPageDataChange = async e =>{
        e.preventDefault();
        let avatar = this.canvasUserRef.current !== null ? this.canvasUserRef.current.toBlob() : null;
        await fetch('/changeByAdmin', {
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
                avatar: avatar,
                len: avatar !== null ? avatar.length : 0,
                id: this.state.id,
                session: Cookies.get('sessionId'),
            }),
        }).then(()=>{
            this.state.correctLogin = false;
            this.setState({avatar: avatar});
        });
        alert('Successfully modified');
    };

    async onDeleteUser(deleted){
        await fetch('/deleteUserByAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.id,
                session: Cookies.get('sessionId'),
                deleted: deleted,
            }),
        }).then(()=>{
            this.state.correctLogin = false;
            this.setState({deleted: deleted});
        });
    }

    canvasUserRef = React.createRef();

    imageChange(canvas){
        if (canvas.current !== null){
            canvas.current.changeImage(this.state.avatarPath);
        }
    };

    render(){
        validateAdminConnection();
        if (!this.loaded){
            this.onUserDataGet();
        }
        return(
            <div className="PersonsPage">
                <form onSubmit={this.onPersonPageDataChange}>
                    <h1>
                        <strong>Data change: {this.state.getDeleted ? '(Deleted)' : ''}</strong>
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
                    <input
                        type="text"
                        value={this.state.branch === null ? '' : this.state.branch}
                        onChange={e => this.setState({branch: e.target.value})}
                    />
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
                    <button onClick={() => this.imageChange(this.canvasUserRef)} type="button">Load</button><br/>
                    {
                        this.state.avatarPath === ''
                            ? <p>No avatar</p>
                            : <Canvas avatarPath={this.state.avatarPath} ref={this.canvasUserRef}/>
                    }
                    <button type="submit">Confirm</button>
                    {
                        this.state.deleted
                            ? <button onClick={() => this.onDeleteUser(false)} type="button">Undelete</button>
                            : <button onClick={() => this.onDeleteUser(true)} type="button">Delete</button>
                    }
                    <button onClick={() => window.location.assign('http://localhost:3000/admin/book')} type="button">Back</button>
                </form>
            </div>
        )
    }
}

export default AdminUserPageUpdate;