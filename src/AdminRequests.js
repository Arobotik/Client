import React, { Component } from 'react';
import {validateAdminConnection} from './validators';
import {setAdminRequest, getAllRequests} from "./adminFetches";

class AdminRequests extends Component {
    state= {
        bookData: [],
        requestsSortByAsc: true,
        requestsShowWithStatus: '',
    };

    loaded = false;

    async onRequestAction(target, requesting, status){
        const body = await setAdminRequest(target, requesting, status).then(() => this.loaded = false);
        if (body.result === false){
            alert('Error in request changing')
        }
        this.onRequestsClick();
    }

    onRequestsClick = async e =>{
        const body = await getAllRequests(this.state.requestsSortByAsc, this.state.requestsShowWithStatus);
        if (body.result === true){
            this.setState({requests: body.express, loaded: true});
        }
        else{
            alert('Error in getting requests');
        }
    };

    render(){
        validateAdminConnection();
            let item = 0;
            if (!this.loaded){
                this.onRequestsClick().then(()=>{this.loaded = true});
            }
            return(
                <div>
                    <button onClick={() => window.location.assign(`http://localhost:3000/admin/book`)} type="button">Back</button><br/>
                    <strong>Requests</strong><br/>
                    <button onClick={() => {this.setState({requestsSortByAsc: !this.state.requestsSortByAsc}); this.loaded = false;}}
                            type="button"
                    >
                        {this.state.requestsSortByAsc
                            ? 'Sort by date DESC'
                            : 'Sort by date ASC'
                        }
                    </button><br/>
                    {this.state.requestsShowWithStatus !== ''
                        ? <button onClick={() => {this.setState({requestsShowWithStatus: ''}); this.loaded = false;}}
                                  type="button"
                        >
                            Show all
                        </button>
                        : ''
                    }
                    {this.state.requestsShowWithStatus !==1
                        ? <button onClick={() => {this.setState({requestsShowWithStatus: 1}); this.loaded = false;}}
                                  type="button"
                        >
                            Show only accepted
                        </button>
                        : ''
                    }
                    {this.state.requestsShowWithStatus !== 0
                        ? <button onClick={() => {this.setState({requestsShowWithStatus: 0}); this.loaded = false;}}
                                  type="button"
                        >
                            Show only waiting
                        </button>
                        : ''
                    }
                    {this.state.requestsShowWithStatus !== -1
                        ? <button onClick={() => {this.setState({requestsShowWithStatus: -1}); this.loaded = false;}}
                                  type="button"
                        >
                            Show only rejected
                        </button>
                        : ''
                    }
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
                                <td>
                                    <b>Send date</b>
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
                                            <button onClick={() => this.onRequestAction(req[0], req[2], 1)}>Accept</button>
                                        </td>
                                        <td>
                                            <button onClick={() => this.onRequestAction(req[0], req[2], 0)}>Wait</button>
                                        </td>
                                        <td>
                                            <button onClick={() => this.onRequestAction(req[0], req[2],-1)}>Refuse</button>
                                        </td>
                                        <td>
                                            {req[4]}
                                        </td>
                                        <td>
                                            {req[5]}
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

export default AdminRequests;