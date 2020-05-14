import React, { Component } from 'react';
import Canvas from "./Canvas";

class App extends Component {
    state = {
        id: '',
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
        thisUserId: '',
        thisUserLogin: '',
        thisUserPassword: '',
        avatar: '',
        avatarPath: '',
        branches: [],
        page: 0,
        correctLogin: false,
        book: '',
        requests: '',
        oldLogin: '',
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
        //const response =
        const response = await fetch('/loginPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login: this.state.login, password: this.state.password }),
        });
        const body = await response.json();

        if (body.logged){
            this.setState({
                logged: true,
                page: 4,
                thisUserId: body.id,
                thisUserLogin: this.state.login.toLowerCase(),
                thisUserPassword: this.state.password});
            this.loaded = false;
        }
        else{
            alert('Incorrect Login or Password');
        }
    };

    onRegisterButtonClick = async e => {
        e.preventDefault();
        this.setState({login: '', password: '', page: 1});
    };

    onLoginRegister = async e => {
        e.preventDefault();
        this.validateNewLoginData(true).then(result => {
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
                    id: null,
                    page: 2});
                break;
                case 1:
                    alert('Password should contains only A-Z, a-z, 0-9 and at least one of each of them');
                break;
                case 2:
                    alert('Password should contains at least 8 and not more then 16 symbols')
                break;
                case 3:
                    alert('Login is incorrect');
                break;
                default:
                    alert('Login is already occupied')
            }
        });
    };

    canvasRef = React.createRef();
    canvasEditRef = React.createRef();

    onDataRegister = async e => {
        e.preventDefault();
        this.validateNewUserData().then(result => {
            switch(result){
                case 0:
                    let avatar = this.canvasRef.current.toBlob();
                    this.setState({page: 3, avatar: avatar});
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
    };

    onBackButtonClick = async e => {
        e.preventDefault();
        this.loaded = false;
        this.setState({page: this.state.page - 1});
    };

    makeUint8Array(data){
        let arr = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++ ) {
            arr[i] = data[i];
        }
        return arr;
    }

    async onLinkNameClick(targetId){
        let response;
        if (targetId !== this.state.thisUserId) {
            response = await fetch('/getInfoAbout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id: targetId, requesting: this.state.thisUserId}),
            });
        }
        else {
            response = await fetch('/getMyPage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({login: this.state.thisUserLogin}),
            });
        }
        const body = await response.json();

        this.loaded = false;
        let avatar = body.avatar !== null && body.avatar !== '' && body.avatar !== undefined
            ? new Blob([this.makeUint8Array(body.avatar)], {type: 'image/png'})
            : '';
        this.setState({
            id: body.id,
            name: body.name,
            birthDate: body.birthDate,
            branch: body.branch,
            workPhone: body.workPhone,
            position: body.position,
            workPlace: body.workPlace,
            privatePhone1: body.privatePhone1,
            privatePhone2: body.privatePhone2,
            privatePhone3: body.privatePhone3,
            about: body.about,
            avatar: avatar,
            avatarPath: avatar !== '' ? URL.createObjectURL(avatar) : '',
            page: targetId === this.state.thisUserId ? 6 : 5
        });
    }

    async onBookAllGet(){
        const response = await fetch('/bookAllGet');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        if (body.express !== null){
            this.setState({book: body.express});
            this.loaded = true;
        }
        else{
            this.setState({book: null});
        }
    };

    async onGetAllBranches(){
        const response = await fetch('/getAllBranches');
        const body = await response.json();

        this.setState({branches: body.express});
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

    imageChange(canvas){
        if (canvas.current !== null){
            canvas.current.changeImage(this.state.avatarPath);
        }
    };
    validateDate(value)
    {
        console.log('value' + value);
        let arrD = value.split(value.includes('.') ? '.' : '-');
        arrD[1] -= 1;
        let d = new Date(arrD[0], arrD[1], arrD[2]);

        return (d.getFullYear() === Number(arrD[0])) &&
            (d.getMonth() === Number(arrD[1])) &&
            (d.getDate() === Number(arrD[2]));
    }
    onRequestAccess = async e => {
        const response = await fetch('/requestAccess', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({requestionLogin: this.state.thisUserLogin, requestedId: this.state.id}),
        });
        const body = await response.json();

        switch (body.requested){
            case 0:
                alert('Requestion already sended');
                break;
            case 2:
                alert('Requestion sended');
                break;
            default:
                alert('Requestion already rejected');
        }
    };

    async validateNewLoginData(loginChanged){
        let res = 0;
        if (loginChanged) {
            const response = await fetch('/userValidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({login: this.state.login}),
            });
            const body = await response.json();
            res = body.validate ? 0 : 4;
        }
        let passValidate = /([a-z]+[A-Z]+[0-9]+|[a-z]+[0-9]+[A-Z]+|[A-Z]+[a-z]+[0-9]+|[A-Z]+[0-9]+[a-z]+|[0-9]+[a-z]+[A-Z]+|[0-9]+[A-Z]+[a-z]+)/;
        let loginValidate = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
        if (!passValidate.test(this.state.password)){
            return 1;
        }
        if (this.state.password.length > 16 || this.state.password.length < 8){
            return 2;
        }
        if (!loginValidate.test(this.state.login.toLowerCase()) || this.state.login.length > 25) {
            return 3;
        }
        return res;
    }

    async validateNewUserData(){
        let phoneValidate = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;
        if (this.state.name.length === 0){
            return 1;
        }
        if (!phoneValidate.test(this.state.workPhone)){
            return 2;
        }
        if (!phoneValidate.test(this.state.privatePhone1)){
            return 3;
        }
        if ((this.state.privatePhone2 !== undefined &&
            this.state.privatePhone2 !== null &&
            this.state.privatePhone2 !== '' &&
            !phoneValidate.test(this.state.privatePhone2)) ||
            (this.state.privatePhone3 !== undefined &&
            this.state.privatePhone2 !== null &&
            this.state.privatePhone3 !== '' &&
            !phoneValidate.test(this.state.privatePhone3))){
            return 4;
        }
        if (!this.validateDate(this.state.birthDate)){
            return 5;
        }
        return 0;
    }

    onNewUserRegister = async e =>{
        e.preventDefault();
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
            }),
        });
        this.setState({page: 0});
    };

    onGetNameById(id){
        for (let item of this.state.book){
            if (Number(item[0]) === Number(id)){
                return item[1];
            }
        }
    }

    async onRequestionAction(requesting, status){
        const response = await fetch('/requestionAction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({login: this.state.thisUserLogin, requesting: requesting, status: status ? 1 : -1}),
        });
        await response.json();
        this.onGetAllRequests();
    };

    async onGetAllRequests(){
        const response = await fetch('/requestsAllGet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login: this.state.thisUserLogin }),
        });
        const body = await response.json();

        this.setState({requests: body.express})
    }

    onPersonPageDataChange = async e =>{
        e.preventDefault();
        this.validateNewLoginData(this.state.thisUserLogin.toLowerCase() !== this.state.login.toLowerCase())
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
            this.validateNewUserData().then(async result  =>  {
                switch (result) {
                    case 0:
                        this.setState({avatar: this.canvasEditRef.current.toBlob()});
                        alert('Successfully modified');
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
                                oldLogin: this.state.thisUserLogin,
                                oldPassword: this.state.thisUserPassword
                            }),
                        });
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

    render() {
        if (!this.state.logged) {
            if (this.state.page === 0) {
                return (
                    <div className="Login">
                        <form onSubmit={this.onLogin}>
                            <h1>
                                <strong>Welcome</strong>
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
                            <button onClick={this.onRegisterButtonClick} type="button">Register</button>
                        </form>
                    </div>
                );
            } else if (this.state.page === 1) {
                return (
                    <div className="RegisterState1">
                        <form onSubmit={this.onLoginRegister}>
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
                            <button type="submit">Continue</button>
                            <button onClick={this.onBackButtonClick} type="button">Back</button>
                        </form>
                    </div>
                );
            } else if (this.state.page === 2) {
                return (
                    <div className="Register">
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
                            <button onClick={this.onBackButtonClick} type="button">Back</button>
                        </form>
                    </div>
                );
            } else if (this.state.page === 3) {
                return (
                    <div className="Register">
                        <form onSubmit={this.onNewUserRegister}>
                            <p>
                                <strong>Are you sure?</strong>
                            </p>
                            <button type="submit">Continue</button>
                            <button onClick={this.onBackButtonClick} type="button">Back</button>
                        </form>
                    </div>
                )
            }
        }
        else{
            if (this.state.page === 4){
                if (!this.loaded){
                    this.onBookAllGet();
                    this.loaded = true;
                }
                return (
                    <div className="Book">
                            {this.state.book === null || this.state.book === ''
                                ? <strong>Wait</strong>
                                : <ul>{
                                    this.state.book.map(item => {
                                        return <li key={item[0]}>
                                            <button onClick={() => this.onLinkNameClick(item[0])}>{item[1]}</button>
                                        </li>
                                })
                                }</ul>
                            }
                        <button onClick={this.onExitButtonClick} type="button">Exit</button>
                    </div>
                )
            }
            else if (this.state.page === 5){
                return (
                  <div>
                      <p>
                          <strong>Avatar:</strong>
                      </p>
                      {
                          this.state.avatarPath === ''
                              ? <p>No avatar</p>
                              : <Canvas avatarPath={this.state.avatarPath} ref={this.canvasRef}/>
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
                      <button onClick={this.onBackButtonClick} type="button">Back</button>
                      {this.state.privatePhone1 === undefined
                          ? <button onClick={this.onRequestAccess} type="button">Request Access</button>
                          : <br />
                      }
                  </div>
                );
            }
            else if (this.state.page === 6){
                if (!this.loaded){
                    this.onGetAllRequests();
                    this.onGetAllBranches();
                    this.loaded = true;
                }
                return(
                    <div className="PersonsPage">
                        <p>
                            <strong>Avatar:</strong>
                        </p>
                        {
                            this.state.avatarPath === ''
                                ? <p>No avatar</p>
                                : <Canvas avatarPath={this.state.avatarPath}/>
                        }
                        <p>Name: {this.state.name}</p>
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
                        {this.state.privatePhone1 === undefined
                            ? <button onClick={this.onRequestAccess} type="button">Request Access</button>
                            : <br />
                        }
                        <button onClick={() => this.setState({page: this.state.page + 1})} type="button">Change Data</button><br/>
                        <button onClick={() => this.setState({page: this.state.page - 2})} type="button">Back</button><br/>
                        <strong>Requests</strong>
                        {this.state.requests === null || this.state.requests === ''
                            ? 'None'
                            : <table>{
                                <tbody>{
                                    this.state.requests.map(item => {
                                        return <tr key={item}>
                                            <td>
                                                {this.onGetNameById(item)}
                                            </td>
                                            <td>
                                                <button onClick={() => this.onRequestionAction(item, true)}>Accept</button>
                                            </td>
                                            <td>
                                                <button onClick={() => this.onRequestionAction(item, false)}>Refuse</button>
                                            </td>
                                        </tr>
                                    })
                                }
                                </tbody>
                            }
                            </table>
                        }
                    </div>);
            }
            else if (this.state.page === 7){
                console.log(this.state.branch);
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
                            <button onClick={this.onBackButtonClick} type="button">Back</button><br/>
                        </form>
                    </div>
                )
            }

            }
        }
}

export default App;