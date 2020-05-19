import React, { Component } from 'react';
import Cookies from 'js-cookie';
import {validateConnection} from './validators';
import {getRequests, getLastVisited, setRequest, getMyPage} from './fetches';

class MyPage extends Component {
    state= {
        login: '',
        password: '',
    };

    async onGetAllLastVisited(){
        const body = await getLastVisited();

        this.setState({lastVisited: body.express});
    }

    async onRequestAction(requesting, status){
        const body = await setRequest(requesting, status);
        if (body.result === false){
            alert('Error in status change');
        }
        this.onGetAllRequests();
    };

    async onGetAllRequests(){
        const body = await getRequests();
        if (body.result === true){
            this.setState({requests: body.express});
        }
        else{
            alert('Error in getting requests');
        }
    }

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
                carouselPage: 0,
                about: body.about,
                avatar: avatar,
                avatarPath: avatar !== '' ? URL.createObjectURL(avatar) : '',
            });
        }
        else{
            Cookies.remove('userId');
            Cookies.remove('sessionId');
            window.location.assign('http://localhost:3000/app/login');
        }
    }

    onLinkNameClick(id){
        window.location.assign(`http://localhost:3000/app/page/${id}`);
    }

    render(){
        validateConnection();
            if (!this.loaded){
                this.onGetAllRequests();
                this.onGetAllLastVisited();
                this.onGetMyPage();
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
                            : <img src={this.state.avatarPath} alt={'avatar'}/>
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
                    <button onClick={() => window.location.assign('http://localhost:3000/app/mypageupdate')} type="button">Change Data</button><br/>
                    <button onClick={() => window.location.assign('http://localhost:3000/app/book')} type="button">Back</button><br/>
                    <strong>Requests</strong>
                    {this.state.requests === null || this.state.requests === [] || this.state.requests === undefined
                        ? 'None'
                        : <table>{
                            <tbody>{
                                this.state.requests.map(item => {
                                    return <tr key={item}>
                                        <td>
                                            {item[1]}
                                        </td>
                                        <td>
                                            <button onClick={() => this.onRequestAction(item[0], true)}>Accept</button>
                                        </td>
                                        <td>
                                            <button onClick={() => this.onRequestAction(item[0], false)}>Refuse</button>
                                        </td>
                                    </tr>
                                })
                            }
                            </tbody>
                        }
                        </table>
                    }
                    <strong>Last visited pages:</strong>
                    {this.state.lastVisited === undefined || this.state.lastVisited.length === 0
                        ? 'None'
                        : <div>
                            {this.state.lastVisited.length > 3
                                ? <button onClick={() =>
                                    this.setState({carouselPage: this.state.carouselPage > 0
                                            ? this.state.carouselPage - 1
                                            : Math.floor(this.state.lastVisited.length / 3),
                                    })}
                                > Prev </button>
                                : ''
                            }
                            {
                                this.state.lastVisited.slice(this.state.carouselPage * 3, this.state.carouselPage * 3 + 3).map(item => {
                                    let avatar = item[2] !== null && item[2] !== '' &&item[2] !== undefined
                                        ? new Blob([this.makeUint8Array(item[2])], {type: 'image/png'})
                                        : '';
                                    let avatarPath = avatar !== '' ? URL.createObjectURL(avatar) : '';
                                    return (avatarPath !== ''
                                            ? <img src={avatarPath}
                                                  onClick={() => this.onLinkNameClick(item[0])}
                                                  width={100} height={100}
                                                  key={item[0]} alt={item[1]}/>
                                            : <button onClick={() => this.onLinkNameClick(item[0])} key={item[0]}>{item[1]}</button>
                                             );
                                })
                            }
                            {this.state.lastVisited.length > 3
                                ? <button onClick={() =>
                                    this.setState({carouselPage: this.state.carouselPage < Math.floor(this.state.lastVisited.length / 3)
                                            ? this.state.carouselPage + 1
                                            : 0,
                                    })}
                                > Next </button>
                                : ''
                            }
                        </div>
                    }
                </div>);
        }
}

export default MyPage;