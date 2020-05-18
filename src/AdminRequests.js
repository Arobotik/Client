import React, { Component } from 'react';
import Cookies from 'js-cookie';
import {validateAdminConnection} from './validators';

class AdminRequests extends Component {
    state= {
        bookData: [],
        requestsSortByAsc: true,
        requestsShowWithStatus: '',
    };

    loaded = false;

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
                session: Cookies.get('sessionId'),
            }),
        }).then(() => this.loaded = false);

    }

    onRequestsClick = async e =>{
        const response =  await fetch('/adminGetAllRequests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session: Cookies.get('sessionId'),
                asc: this.state.requestsSortByAsc,
                status: this.state.requestsShowWithStatus,
            }),
        });

        const body = await response.json();
        this.setState({requests: body.express, page: 4, loaded: true});
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