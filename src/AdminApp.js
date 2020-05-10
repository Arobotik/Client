import React, { Component } from 'react';


class AdminApp extends Component {
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
        page: 0,
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
        const response = await fetch('/adminLoginPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login: this.state.login, password: this.state.password }),
        });
        const body = await response.json();
        console.log('BODY' + body.logged)
        if (body.logged){
            this.setState({logged: true, page: 1});
            this.loaded = false;
        }
        else{
            alert('Incorrect Login or Password. Or are you even an admin?');
        }
        console.log("ISONPAGE" + this.state.page);
        //this.isOnPage.page = true;
        //this.setState({ responseToPost: body });
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
            body: JSON.stringify({key: key, isThisUser: true}),
        });
        const body = await response.json();
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
            page: 2,
            oldLogin: this.state.login,
        });
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

    /*<p>{this.state.response}</p>*/
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
            else{
                if (this.state.page === 2){
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
                                <button onClick={this.onBackButtonClick} type="button">Back</button>
                            </form>
                        </div>
                    )
                }
            }
        }
    }
}

export default AdminApp;