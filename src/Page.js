import React, { Component } from 'react';
import Cookies from 'js-cookie';
import {validateConnection} from './validators';

class Page extends Component {
    state = {userId: -1,};

    componentDidMount() {
        if (this.props.match.params.id === Cookies.get('userId')){
            window.location.assign('http://localhost:3000/app/mypage');
        }
        this.setState({userId: this.props.match.params.id,});
    }

    loaded = false;



    onRequestAccess = async e => {
        const response = await fetch('/requestAccess', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({session: Cookies.get('sessionId'), requestedId: this.state.userId}),
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

    makeUint8Array(data){
        let arr = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++ ) {
            arr[i] = data[i];
        }
        return arr;
    }

    async onPageGet() {
        const response = await fetch('/getInfoAbout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: this.state.userId, session: Cookies.get('sessionId')}),
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
                carouselPage: 0,
                about: body.about,
                avatar: avatar,
                avatarPath: avatar !== '' ? URL.createObjectURL(avatar) : '',
            });
            this.loaded = true;
        }
    }

    render(){
        validateConnection();
            console.log(this.state.userId);
            if (!this.loaded){
                this.onPageGet().then(() => this.loaded = true);
            }
            return (this.loaded === false
                ? <div>Wait</div>
                :
                <div>
                    <p>
                        <strong>Avatar:</strong>
                    </p>
                    {
                        this.state.avatarPath === ''
                            ? <p>No avatar</p>
                            : <img src={this.state.avatarPath} alt={'avatar'}/>
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
                    <button onClick={() => window.location.assign('http://localhost:3000/app/book')} type="button">Back</button>
                    {this.state.privatePhone1 === undefined
                        ? <button onClick={this.onRequestAccess} type="button">Request Access</button>
                        : <br />
                    }
                </div>
            );
    }
}

export default Page;