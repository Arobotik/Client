import React, { Component } from 'react';
import Canvas from "./Canvas";


class AdminApp extends Component {
    state = {
        login: '',
        password:'',
        name: '',
        birthDate: '',
        hideYear: false,
        hidePhones: false,
        branch: '',
        position: '',
        workPlace: '',
        workPhone: '',
        privatePhone1: '',
        privatePhone2: '',
        privatePhone3: '',
        about: '',
        logged: false,
        adminLogin: '',
        adminPassword: '',
        avatar: '',
        avatarPath: '',
        page: 0,
    };

    loaded = false;

    componentDidMount() {
        this.callApi()
            .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/loginGet');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    onLogin = async e => {
        e.preventDefault();
        const response = await fetch('/adminLoginPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login: this.state.login, password: this.state.password }),
        });
        const body = await response.json();
        if (body.logged){
            this.setState({logged: true, page: 1, adminLogin: this.state.login, adminPassword: this.state.password});
            this.loaded = false;

        }
        else{
            alert('Incorrect Login or Password. Or are you even an admin?');
        }
    };

    onBackButtonClick = async e => {
        e.preventDefault();
        this.setState({page: this.state.page - 1});
    };

    async onLinkNameClick(login){
        const response = await fetch('/getMyPage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({login: login}),
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
            avatar: avatar,
            avatarPath: avatar !== '' ? URL.createObjectURL(avatar) : '',
            page: 2,
            thisUserLogin: body.login,
            thisUserPassword: body.password
        });
    };

    async onBookAllGet(){
        const response = await fetch('/bookAllGetByAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({login: this.state.adminLogin, password: this.state.adminPassword}),
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        if (body.express !== null){
            this.setState({bookData: body.express});
            this.loaded = true;
        }
        else{
            this.setState({bookData: null});
        }
    };

    canvasUserRef = React.createRef();

    makeUint8Array(data){
        let arr = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++ ) {
            arr[i] = data[i];
        }
        return arr;
    }

    imageChange(canvas){
        if (canvas.current !== null){
            canvas.current.changeImage(this.state.avatarPath);
        }
    };

    onPersonPageDataChange = async e =>{
        e.preventDefault();
        alert('Successfully modified');
        let avatar = this.canvasUserRef.current.toBlob();
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
                avatar: avatar,
                len: avatar.length,
                oldLogin: this.state.thisUserLogin,
                oldPassword: this.state.thisUserPassword,
            }),
        }).then(()=>{
            this.state.correctLogin = false;
            this.setState({page: 2, avatar: avatar});
        });
    };

    onRequestsClick = async e =>{
        const response =  await fetch('/adminGetAllRequests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: this.state.adminLogin.toLowerCase(),
                password: this.state.adminPassword,
            }),
        });

        const body = await response.json();
        this.setState({requests: body.express, page: 4, loaded: true});
    };

    async onRequestionAction(target, requesting, status){
        await fetch('/adminRequestionAction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                target: target,
                requesting: requesting,
                status: status,
                login: this.state.adminLogin.toLowerCase(),
                password: this.state.adminPassword,
            }),
        }).then(() => this.setState({loaded: false,}));

    }

    onExitButtonClick = async e => {
        this.setState({
            login: '',
            password:'',
            name: '',
            birthDate: '',
            hideYear: false,
            hidePhones: false,
            branch: '',
            position: '',
            workPlace: '',
            workPhone: '',
            privatePhone1: '',
            privatePhone2: '',
            privatePhone3: '',
            about: '',
            avatar: '',
            avatarPath: '',
            logged: false,
            thisUserId: '',
            thisUserLogin: '',
            thisUserPassword: '',
            page: 0,
            correctLogin: false,
            oldLogin: '',
        });
    };

    render() {
        if (!this.state.logged) {
            if (this.state.page === 0) {
                return (
                    <div className="Login">
                        <form onSubmit={this.onLogin}>
                            <h1>
                                <strong>Welcome, Admin</strong>
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
                            <button type="submit">Login</button>
                        </form>
                    </div>
                );
            }
        }
        else{
            if (this.state.page === 1){
                if (!this.loaded){
                    this.onBookAllGet();
                }
                return (
                    <div className="Book">
                        {this.state.bookData === null || this.state.bookData === undefined
                            ? <strong>Wait</strong>
                            : <ul>{
                                this.state.bookData.map(item => {
                                    return <li key={item[0]}>
                                        <button onClick={() => this.onLinkNameClick(item[0])}>{item[1]}</button>
                                    </li>
                                })
                            }</ul>
                        }
                        <button onClick={this.onRequestsClick} type="button">Requests</button>
                        <button onClick={this.onExitButtonClick} type="button">Exit</button>
                    </div>
                )
            }
            else if (this.state.page === 2) {
                    return (
                        <div>
                            <p>
                                <strong>Avatar:</strong>
                            </p>
                            {
                                this.state.avatarPath === ''
                                    ? <p>No avatar</p>
                                    : <Canvas avatarPath={this.state.avatarPath} ref={this.canvasUserRef}/>
                            }
                            <h1>Name: {this.state.name}</h1>
                            <p>Birth Date: {this.state.birthDate} </p>
                            <p>Work Phone: {this.state.workPhone}</p>
                            {this.state.privatePhone1 !== undefined
                                ? <p>Private Phone: {this.state.privatePhone1}</p>
                                : <p>Private Phone: Hidden</p>
                            }
                            {this.state.privatePhone2 !== undefined
                                ? <p>Private Phone 2: {this.state.privatePhone2}</p>
                                : <p>Private Phone 2: Hidden</p>
                            }
                            {this.state.privatePhone3 !== undefined
                                ? <p>Private Phone 3: {this.state.privatePhone3}</p>
                                : <p>Private Phone 3: Hidden</p>
                            }
                            <p>Position: {this.state.position === null ? '' : this.state.position}</p>
                            <p>Branch: {this.state.branch === null ? '' : this.state.branch}</p>
                            <p>Work Place: {this.state.workPlace === null ? '' : this.state.workPlace}</p>
                            <p>About: {this.state.about === null ? '' : this.state.about}</p>
                            <button onClick={() => this.setState({page: this.state.page + 1})} type="button">Change Data</button><br/>
                            <button onClick={this.onBackButtonClick} type="button">Back</button>
                        </div>
                    );
                }
            else if (this.state.page === 3){
                    return(
                        <div className="PersonsPage">
                            <form onSubmit={this.onPersonPageDataChange}>
                                <h1>
                                    <strong>Registration:</strong>
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
                                <button onClick={e => this.imageChange(this.canvasUserRef)} type="button">Load</button><br/>
                                {
                                    this.state.avatarPath === ''
                                        ? <p>No avatar</p>
                                        : <Canvas avatarPath={this.state.avatarPath} ref={this.canvasUserRef}/>
                                }
                                <button type="submit">Continue</button>
                                <button onClick={this.onBackButtonClick} type="button">Back</button>
                            </form>
                        </div>
                    )
                }
            else if (this.state.page === 4){
                let item = 0;
                if (!this.loaded){
                    this.onRequestsClick();
                    this.loaded = true;
                }
                return(
                    <div>
                        <button onClick={() => this.setState({page: 1})} type="button">Back</button><br/>
                        <strong>Requests</strong>
                        {this.state.requests === null || this.state.requests === undefined
                            ? 'None'
                            : <table>{
                                <tbody>
                                    <tr>
                                        <td>
                                            <b>To</b>
                                        </td>
                                        <td>
                                            <b>From</b>
                                        </td>
                                        <td colSpan={3}>
                                            <b>Action</b>
                                        </td>
                                        <td>
                                            <b>Status</b>
                                        </td>
                                    </tr>
                                    {
                                        this.state.requests.map(req => {
                                            return <tr key={item++}>
                                                <td>
                                                    {req[1]}
                                                </td>
                                                <td>
                                                    {req[3]}
                                                </td>
                                                <td>
                                                    <button onClick={() => this.onRequestionAction(req[0], req[2], 1)}>Accept</button>
                                                </td>
                                                <td>
                                                    <button onClick={() => this.onRequestionAction(req[0], req[2], 0)}>Wait</button>
                                                </td>
                                                <td>
                                                    <button onClick={() => this.onRequestionAction(req[0], req[2],-1)}>Refuse</button>
                                                </td>
                                                <td>
                                                    {req[4]}
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            }
                            </table>
                        }
                    </div>
                )
            }
        }
    }
}

export default AdminApp;