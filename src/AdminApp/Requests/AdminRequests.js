import React, { Component } from 'react';
import {validateAdminConnection} from '../../Helpers/validators';
import {loadRequests, updateRequests} from "../../Redux/adminActions";
import {connect} from "react-redux";
import {Button, PaginationButton, Table, TableButton} from "../../Styles";

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
                    <Button onClick={() => window.location.assign(`http://localhost:3000/admin/book`)} type="button">Back</Button><br/>
                    <strong>Requests</strong><br/>
                    <Button onClick={() => {this.setState({requestsSortByAsc: !this.state.requestsSortByAsc}); this.loaded = false;}}
                            type="button"
                    >
                        {this.state.requestsSortByAsc
                            ? 'Sort by date DESC'
                            : 'Sort by date ASC'
                        }
                    </Button><br/>
                    {this.state.requestsShowWithStatus !== ''
                        ? <Button onClick={() => {this.setState({requestsShowWithStatus: '', requestsPageCurrent: 0, }); this.loaded = false;}}
                                  type="button"
                        >
                            Show all
                        </Button>
                        : ''
                    }
                    {this.state.requestsShowWithStatus !==1
                        ? <Button onClick={() => {this.setState({requestsShowWithStatus: 1, requestsPageCurrent: 0, }); this.loaded = false;}}
                                  type="button"
                        >
                            Show only accepted
                        </Button>
                        : ''
                    }
                    {this.state.requestsShowWithStatus !== 0
                        ? <Button onClick={() => {this.setState({requestsShowWithStatus: 0, requestsPageCurrent: 0, }); this.loaded = false;}}
                                  type="button"
                        >
                            Show only waiting
                        </Button>
                        : ''
                    }
                    {this.state.requestsShowWithStatus !== -1
                        ? <Button onClick={() => {this.setState({requestsShowWithStatus: -1, requestsPageCurrent: 0, }); this.loaded = false;}}
                                  type="button"
                        >
                            Show only rejected
                        </Button>
                        : ''
                    }
                    {this.state.requests === null || this.state.requests === undefined
                        ? 'None'
                        : <Table>{
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
                                            <TableButton onClick={() => this.onRequestAction(req[0], req[2], 1)}>Accept</TableButton>
                                        </td>
                                        <td>
                                            <TableButton onClick={() => this.onRequestAction(req[0], req[2], 0)}>Wait</TableButton>
                                        </td>
                                        <td>
                                            <TableButton onClick={() => this.onRequestAction(req[0], req[2],-1)}>Refuse</TableButton>
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
                        </Table>
                    }
                    <br/>
                    {this.makePagination().map(item => {
                        return item === Number(this.state.requestsPageCurrent)
                            ? item + 1
                            : (<PaginationButton value={item}
                                       key={item}
                                       onClick={e => {this.setState({requestsPageCurrent: e.target.value}); this.loaded = false;}}
                                       type="button">{item + 1}
                            </PaginationButton>)
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