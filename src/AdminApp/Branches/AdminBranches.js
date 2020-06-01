import React, { Component } from 'react';
import {validateAdminConnection} from '../../Helpers/validators';
import {loadBranches, updateBranches} from "../../Redux/adminActions";
import {connect} from "react-redux";
import {Button, Input, Table, TableButton} from "../../Styles";

let globalVar;

class AdminBranches extends Component {
    state= {
        branches: [],
        branchesSortByAsc: true,
        editedBranch: -1,
        editedBranchData: '',
        toDeleteBranch: -1,
        branchesWereEdited: false,
    };

    updateState(state){
        this.setState({branches: state.branches})
    }

    componentDidMount(){
        globalVar = {};
        globalVar.callback = (state) => {
            this.updateState(state);
        };
    }

    onBranchesClick = async e =>{
        this.props.loadBranches(this.state.branchesSortByAsc);
        this.setState({
            editedBranch: -1,
            editedBranchData: '',
            toDeleteBranch: -1,
            branchesWereEdited: false,
        });
        this.loaded = true;
    };

    confirmBranchEdit = async e =>{
        this.props.updateBranches(this.props.sessionId, this.state.branches);
        this.setState({
            editedBranch: -1,
            editedBranchData: '',
            toDeleteBranch: -1,
            branchesWereEdited: false,
        });
        this.loaded = false;
    };

    loaded = false;

    render() {
        validateAdminConnection(this.props.sessionId);
        if (!this.loaded) {
            this.onBranchesClick();
        }
        if (this.state.toDeleteBranch !== -1) {
            this.state.branches.splice(this.state.toDeleteBranch, 1);
        }
        let item = -1;
        return (
            <div>
                <Button onClick={() => {
                    this.setState({branchesSortByAsc: !this.state.branchesSortByAsc});
                    this.loaded = false;
                }}
                        type="button"
                >
                    {this.state.branchesSortByAsc
                        ? 'Sort by name DESC'
                        : 'Sort by name ASC'
                    }
                </Button>
                <br/>
                <Button onClick={() => {
                    let branches = this.state.branches;
                    if (branches === null || branches === undefined) {
                        branches = [];
                    }
                    let editedBranch = this.state.editedBranch;
                    if (editedBranch !== -1) {
                        if (this.state.editedBranchData !== '') {
                            branches[editedBranch][1] = this.state.editedBranchData;
                        } else {
                            branches.splice(editedBranch, 1);
                        }
                    }
                    branches.push([-1, '']);
                    editedBranch = branches.length - 1;
                    this.setState({
                        editedBranch: editedBranch,
                        editedBranchData: branches[editedBranch][1],
                        branchesWereEdited: true,
                        branches: branches,
                        toDeleteBranch: -1,
                    });
                }} type="button">Add
                </Button>
                <br/>
                <strong>Branches</strong>
                {this.state.branches === null || this.state.branches === undefined || this.state.branches === []
                    ? 'None'
                    : <Table>{
                        <tbody>
                        <tr>
                            <td>
                                <b>Branch</b>
                            </td>
                            <td colSpan={3}>
                                <b>Action</b>
                            </td>
                        </tr>
                        {
                            this.state.branches.map(req => {
                                let thisItem = ++item;
                                return <tr key={thisItem}>
                                    <td>
                                        {this.state.editedBranch === thisItem
                                            ? <Input
                                                type="text"
                                                value={this.state.editedBranchData}
                                                onChange={e => this.setState({editedBranchData: e.target.value})}
                                            />
                                            : req[1]
                                        }
                                    </td>
                                    <td>
                                        {
                                            this.state.editedBranch === thisItem
                                                ? <TableButton onClick={() => {
                                                    req[1] = this.state.editedBranchData;
                                                    let editedBranch = this.state.editedBranch;
                                                    this.setState({
                                                        editedBranch: -1,
                                                        branchesWereEdited: true,
                                                        toDeleteBranch: this.state.editedBranchData === '' ? editedBranch : -1,
                                                    });
                                                }}>Confirm</TableButton>
                                                : <TableButton onClick={() => {
                                                    let editedBranch = this.state.editedBranch;
                                                    this.setState({
                                                        editedBranch: thisItem,
                                                        editedBranchData: req[1],
                                                        toDeleteBranch: this.state.editedBranchData === '' ? editedBranch : -1,
                                                    });
                                                }}>Edit</TableButton>
                                        }
                                    </td>
                                    <td>
                                        <TableButton onClick={() => {
                                            this.setState({
                                                editedBranch: -1,
                                                toDeleteBranch: thisItem,
                                                branchesWereEdited: true
                                            });
                                        }}>Delete
                                        </TableButton>
                                    </td>
                                </tr>
                            })
                        }
                        </tbody>
                    }
                    </Table>
                }
                {this.state.branchesWereEdited && this.state.branches !== []
                    ? <Button onClick={this.confirmBranchEdit}>Confirm changes</Button>
                    : ''
                }
                <Button onClick={() => window.location.assign('http://localhost:3000/admin/book')} type="button">Back
                </Button>
                <br/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log(state);
    if (globalVar !== undefined){
        globalVar.callback(state.admin);
    }
    return {
        branches: state.admin.branches,
        sessionId: state.admin.sessionId
    }
};

const mapDispatchToProps = {
    loadBranches,
    updateBranches
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminBranches);