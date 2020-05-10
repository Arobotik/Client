import React, { Component } from 'react';


class App extends Component {
    state = {
        //response: '',
        login: '',
        password:'',
        //responseToPost: '',
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
        thisUserTabName: '',
        page: 0,
        correctLogin: false,
        oldLogin: '',
    };

    loaded = false;

    componentDidMount() {
        this.callApi()
            /*.then(res => this.setState({ response: res.express }))*/
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
            console.log(body.tabName);
            this.setState({logged: true, page: 4, thisUserTabName: body.tabName});
            this.loaded = false;
        }
        else{
            alert('Incorrect Login or Password');
        }
        //console.log("ISONPAGE" + this.state.page);
        //this.isOnPage.page = true;
        //this.setState({ responseToPost: body });
    };

    onRegisterButtonClick = async e => {
        e.preventDefault();
        this.setState({login: '', password: '', page: 1});
    };

    onLoginRegister = async e => {
        e.preventDefault();
        this.validateNewLoginData().then(result => {
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
                    bookData: null,
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
        ///////VALIDATING///////

    };

    onDataRegister = async e => {
        e.preventDefault();
        this.validateNewUserData().then(result => {
            switch(result){
                case 0:
                    this.setState({page: 3});
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
                default: break;
            }
        });
        ///////VALIDATING///////
    };

    onBackButtonClick = async e => {
        e.preventDefault();
        this.setState({page: this.state.page - 1});
    };

    async onLinkNameClick(key){
        //const response =
        const response = await fetch('/getInfoAbout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({key: key, isThisUser: this.state.thisUserTabName === key}),
        });
        const body = await response.json();
        if (this.state.thisUserTabName === key){
            this.setState({
                name: body.name,
                //this.state.birthDate = body.birthDate,
                login: body.login,
                password: body.password,
                privatePhone1: body.privatePhone1,
                privatePhone2: body.privatePhone2,
                privatePhone3: body.privatePhone3,
                branch: body.branch,
                workPhone: body.workPhone,
                position: body.position,
                workPlace: body.workPlace,
                about: body.about,
                page: 6,
                oldLogin: this.state.login,
            });
        }
        else{
            this.setState({
                name: body.name,
                //this.state.birthDate = body.birthDate,
                branch: body.branch,
                workPhone: body.workPhone,
                position: body.position,
                workPlace: body.workPlace,
                about: body.about,
                page: 5
            });
        }
        /*if (body){
            this.setState({logged: true});
        }
        else{
            alert('Incorrect Login or Password');
        }*/
    };

    async onBookAllGet(){
        const response = await fetch('/bookAllGet');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        if (body.express !== null){
            console.log(body.express[0]);
            this.setState({bookData: body.express});
            this.loaded = true;
        }
        else{
            this.setState({bookData: null});
        }
    };

    async validateNewLoginData(loginChanged = true){
        let res = 0;
        console.log('lchan ' + loginChanged)
        if (loginChanged) {
            const response = await fetch('/userValidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({login: this.state.login}),
            });
            const body = await response.json();
            console.log(body.validate);
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
        // if (this.) BIRTHDATE CHECK
        if (!phoneValidate.test(this.state.workPhone)){
            return 2;
        }
        if (!phoneValidate.test(this.state.privatePhone1)){
            return 3;
        }
        if ((this.state.privatePhone2 !== undefined && this.state.privatePhone2 !== '' && !phoneValidate.test(this.state.privatePhone2)) ||
            (this.state.privatePhone3 !== undefined && this.state.privatePhone3 !== '' && !phoneValidate.test(this.state.privatePhone3))){
            return 4;
        }
        return 0;
    }

    onNewUserRegister = async e =>{
        //const response =
        await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: this.state.login,
                password: this.state.password,
                responseToPost: this.state.responseToPost,
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
                about: this.state.about, }),
        });
        //const body = await response.text();
        //this.isOnPage.page = true;
        //this.setState({ responseToPost: body });
    };


    onPersonPageDataChange = async e =>{
        e.preventDefault();
        this.validateNewLoginData(this.state.oldLogin.toLowerCase() !== this.state.login.toLowerCase())
            .then(result => {
                console.log('res ' + result);
            switch (result){
                case 0:
                    break;
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
        }).then(result => {
            this.validateNewUserData().then(result => {
                switch (result) {
                    case 0:
                        alert("LOL");
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
                        break;
                }
            });
        });
        this.state.correctLogin = false;
    };

    /*<p>{this.state.response}</p>*/
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
                            /><br/>

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
            console.log("PAGE" + this.state.page);
            if (this.state.page === 4){
                if (!this.loaded){
                    this.onBookAllGet();
                    this.loaded = true;
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
                    </div>
                )
            }
            else if (this.state.page === 5){
                return (
                  <div>
                      <p>Name: {this.state.name}</p>
                      <p>Branch: {this.state.branch}</p>
                      <p>Work Phone: {this.state.workPhone}</p>
                      <p>Position: {this.state.position}</p>
                      <p>Work Place: {this.state.workPlace}</p>
                      <p>About: {this.state.about}</p>
                      <button onClick={this.onBackButtonClick} type="button">Back</button>
                  </div>
                );
            }
            else if (this.state.page === 6){
                console.log('old ' + this.state.oldLogin + 'new' + this.state.login);
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
                            /><br/>

                            <button type="submit">Continue</button>
                            <button onClick={() => this.setState({page: this.state.page - 2})} type="button">Back</button>
                        </form>
                    </div>
                )
            }

            }
        }
}

export default App;