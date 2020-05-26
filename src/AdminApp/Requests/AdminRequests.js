import React, { Component } from 'react';
import {validateAdminConnection} from '../../Helpers/validators';
import {loadRequests, updateRequests} from "../../Redux/adminActions";
import {connect} from "react-redux";

let globalVar;

class AdminRequests extends Component {
    state= {
        requests: [],
        requestsSortByAsc: true,
        requestsShowWithStatus: '',
        requestsPageCurrent: 0,
    };

    componentDidMount(){
        globalVar = {};
        globalVar.callback = (state) => {
            this.updateState(state);
        };
    }

    updateState(state){
        this.setState({requests: state.requests})
    }

    loaded = false;

    async onRequestAction(target, requesting, status){
        this.props.updateRequests(this.props.sessionId, target, requesting, status);
        this.onRequestsClick();
    }

    makePagination(){
        return Array.apply(null, {length: this.props.requestsPagesCount}).map(Number.call, Number);
    }

    onRequestsClick = async e =>{
        this.props.loadRequests(this.props.sessionId, this.state.requestsPageCurrent, this.state.requestsSortByAsc, this.state.requestsShowWithStatus);
    };

    render(){
        validateAdminConnection(this.props.sessionId);
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
                        ? <button onClick={() => {this.setState({requestsShowWithStatus: '', requestsPageCurrent: 0, }); this.loaded = false;}}
                                  type="button"
                        >
                            Show all
                        </button>
                        : ''
                    }
                    {this.state.requestsShowWithStatus !==1
                        ? <button onClick={() => {this.setState({requestsShowWithStatus: 1, requestsPageCurrent: 0, }); this.loaded = false;}}
                                  type="button"
                        >
                            Show only accepted
                        </button>
                        : ''
                    }
                    {this.state.requestsShowWithStatus !== 0
                        ? <button onClick={() => {this.setState({requestsShowWithStatus: 0, requestsPageCurrent: 0, }); this.loaded = false;}}
                                  type="button"
                        >
                            Show only waiting
                        </button>
                        : ''
                    }
                    {this.state.requestsShowWithStatus !== -1
                        ? <button onClick={() => {this.setState({requestsShowWithStatus: -1, requestsPageCurrent: 0, }); this.loaded = false;}}
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
                    <br/>
                    {this.makePagination().map(item => {
                        return item === Number(this.state.requestsPageCurrent)
                            ? item + 1
                            : (<button value={item}
                                       key={item}
                                       onClick={e => {this.setState({requestsPageCurrent: e.target.value}); this.loaded = false;}}
                                       type="button">{item + 1}
                            </button>)
                    })
                    }
                    <br/>
                </div>
            )
        }
}

const mapStateToProps = state => {
    console.log(state);
    if (globalVar !== undefined){
        globalVar.callback(state.admin);
    }
    return {
        requestsData: state.admin.requests,
        requestsPagesCount: state.admin.requestsPagesCount,
        sessionId: state.admin.sessionId
    }
};

const mapDispatchToProps = {
    loadRequests,
    updateRequests
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminRequests);