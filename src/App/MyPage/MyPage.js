import React, { Component } from 'react';
import {validateConnection} from '../../Helpers/validators';
import {getMyLastVisited, getMyRequests, loadMyPage, setRequest} from "../../Redux/actions";
import {connect} from "react-redux";

class MyPage extends Component {
    state= {
        login: '',
        password: '',
        carouselPage: 0,
    };

    async onGetAllLastVisited(){
        this.props.getMyLastVisited(this.props.sessionId);
    }

    makeUint8Array(data){
        let arr = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++ ) {
            arr[i] = data[i];
        }
        return arr;
    }

    async onRequestAction(requesting, status){
        this.props.setRequest(this.props.sessionId, requesting, status);
        this.onGetAllRequests();
    };

    async onGetAllRequests(){
        this.props.getMyRequests(this.props.sessionId);
    }

    loaded = false;

    async onGetMyPage(){
        this.props.loadMyPage(this.props.sessionId)
    }

    onLinkNameClick(id){
        window.location.assign(`http://localhost:3000/app/page/${id}`);
    }

    render(){
        validateConnection(this.props.sessionId);
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
                        this.props.avatarPath === ''
                            ? <p>No avatar</p>
                            : <img src={this.props.avatarPath} alt={'avatar'}/>
                    }
                    <p>Name: {this.props.name}</p>
                    <p>Birth Date: {this.props.birthDate} </p>
                    <p>Work Phone: {this.props.workPhone}</p>
                    {this.props.privatePhone1 !== undefined
                        ? <p>Private Phone: {this.props.privatePhone1}</p>
                        : <p>Private Phone: Hidden</p>
                    }
                    {this.state.privatePhone2 !== undefined
                        ? <p>Private Phone 2: {this.props.privatePhone2}</p>
                        : <p>Private Phone 2: Hidden</p>
                    }
                    {this.state.privatePhone3 !== undefined
                        ? <p>Private Phone 3: {this.props.privatePhone3}</p>
                        : <p>Private Phone 3: Hidden</p>
                    }
                    <p>Position: {this.props.position === null ? '' : this.props.position}</p>
                    <p>Branch: {this.props.branch === null ? '' : this.props.branch}</p>
                    <p>Work Place: {this.props.workPlace === null ? '' : this.props.workPlace}</p>
                    <p>About: {this.props.about === null ? '' : this.props.about}</p>
                    {this.props.privatePhone1 === undefined
                        ? <button onClick={this.onRequestAccess} type="button">Request Access</button>
                        : <br />
                    }
                    <button onClick={() => window.location.assign('http://localhost:3000/app/mypageupdate')} type="button">Change Data</button><br/>
                    <button onClick={() => window.location.assign('http://localhost:3000/app/book')} type="button">Back</button><br/>
                    <strong>Requests</strong>
                    {this.props.requests === null || this.props.requests === [] || this.props.requests === undefined
                        ? 'None'
                        : <table>{
                            <tbody>{
                                this.props.requests.map(item => {
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
                    {this.props.lastVisited === undefined || this.props.lastVisited.length === 0
                        ? 'None'
                        : <div>
                            {this.props.lastVisited.length > 3
                                ? <button onClick={() =>
                                    this.setState({carouselPage: this.state.carouselPage > 0
                                            ? this.state.carouselPage - 1
                                            : Math.floor(this.props.lastVisited.length / 3),
                                    })}
                                > Prev </button>
                                : ''
                            }
                            {
                                this.props.lastVisited.slice(this.state.carouselPage * 3, this.state.carouselPage * 3 + 3).map(item => {
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
                            {this.props.lastVisited.length > 3
                                ? <button onClick={() =>
                                    this.setState({carouselPage: this.state.carouselPage < Math.floor(this.props.lastVisited.length / 3)
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

const mapStateToProps = state => {
    console.log(state);
    return {
        id: state.user.userId,
        name: state.user.name,
        birthDate: state.user.birthDate,
        branch: state.user.branch,
        workPhone: state.user.workPhone,
        position: state.user.position,
        workPlace: state.user.workPlace,
        privatePhone1: state.user.privatePhone1,
        privatePhone2: state.user.privatePhone2,
        privatePhone3: state.user.privatePhone3,
        carouselPage: 0,
        about: state.user.about,
        avatar: state.user.avatar,
        avatarPath: state.user.avatarPath,
        sessionId: state.user.sessionId,
        requests: state.user.requests,
        lastVisited: state.user.lastVisited,
    }
};

const mapDispatchToProps = {
    loadMyPage,
    getMyRequests,
    getMyLastVisited,
    setRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);