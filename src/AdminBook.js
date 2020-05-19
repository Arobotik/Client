import React, { Component } from 'react';
import Cookies from 'js-cookie';
import {validateAdminConnection} from './validators';
import {getAllPages} from "./adminFetches";

class AdminBook extends Component {
    state= {
        bookData: [],
    };

    loaded = false;

    onLinkNameClick(id){
        window.location.assign(`http://localhost:3000/admin/userpageupdate/${id}`);
    }

    async onBookAllGet(deleted = false){
        const body = await getAllPages(deleted);
        if (body.result === 'error'){
            window.location.assign('http://localhost:3000/admin/login');
        }
        if (body.express !== null){
            this.setState({bookData: body.express});
            this.loaded = true;
        }
        else{
            this.setState({bookData: null});
        }
    };

    onExitButtonClick = async e => {
        Cookies.remove('sessionId');
        window.location.assign('http://localhost:3000/admin/login');
    };

    render(){
        validateAdminConnection();
            if (!this.loaded){
                this.onBookAllGet(this.state.getDeleted);
            }
            return (
                <div className="Book">
                    <strong>{this.state.getDeleted ? 'Deleted users' : 'Undeleted users'}</strong>
                    {this.state.bookData === null || this.state.bookData === undefined || this.state.bookData === []
                        ? <strong>Wait</strong>
                        : <ul>{
                            this.state.bookData.map(item => {
                                return <li key={item[0]}>
                                    <button onClick={() => this.onLinkNameClick(item[0])}>{item[1]}</button>
                                </li>
                            })
                        }</ul>
                    }
                    <button onClick={() => window.location.assign('http://localhost:3000/admin/requests')} type="button">Requests</button>
                    <button onClick={() => {this.setState({getDeleted: !this.state.getDeleted,}); this.loaded = false;}}
                            type="button">
                        {this.state.getDeleted ? 'Get undeleted' : 'Get deleted'}
                    </button>
                    <button onClick={() => window.location.assign('http://localhost:3000/admin/branches')} type="button">Branches</button>
                    <button onClick={this.onExitButtonClick} type="button">Exit</button>
                </div>
            )
        }
}

export default AdminBook;