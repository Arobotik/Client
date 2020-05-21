import React, { Component } from 'react';
import Cookies from 'js-cookie';
import {validateAdminConnection} from './validators';
import {getAllPages} from "./adminFetches";
import BookSite from "./BookSite";

class AdminBook extends Component {
    state= {
        filter: '',
        bookData: [],
        usersSortByAsc: true,
        bookPageCurrent: 0,
        bookPagesCount: 0,
    };

    loaded = false;

    onLinkNameClick(id){
        window.location.assign(`http://localhost:3000/admin/userpageupdate/${id}`);
    }

    makePagination(){
        return Array.apply(null, {length: this.state.bookPagesCount}).map(Number.call, Number);
    }

    async onBookAllGet(deleted = false){
        const body = await getAllPages(this.state.bookPageCurrent, this.state.filter, deleted, this.state.usersSortByAsc);
        if (body.result === 'error'){
            window.location.assign('http://localhost:3000/admin/login');
        }
        if (body.express !== null){
            this.setState({bookData: body.express, bookPagesCount: body.pageCount,});
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
                    <strong>{this.state.getDeleted ? 'Deleted users' : 'Undeleted users'}</strong><br/>
                    <button onClick={() => {
                        this.setState({usersSortByAsc: !this.state.usersSortByAsc});
                        this.loaded = false;}}
                            type="button"
                    >
                        {this.state.usersSortByAsc
                            ? 'Sort by name DESC'
                            : 'Sort by name ASC'
                        }
                    </button><br/>
                    <strong>Find users:</strong>
                    <input
                        type="text"
                        value={this.state.filter}
                        onChange={e => {
                            this.setState({filter: e.target.value, bookPageCurrent: 0,});
                            this.loaded = false;
                        }
                        }
                    /><br/>
                    {this.state.bookData === null || this.state.bookData === undefined || this.state.bookData === []
                        ? <strong>Wait</strong>
                        : <BookSite callback={this.onLinkNameClick} book={this.state.bookData}/>
                    }
                    <br/>
                    {this.makePagination().map(item => {
                        return item === Number(this.state.bookPageCurrent)
                            ? item + 1
                            : (<button value={item}
                                       key={item}
                                       onClick={e => {this.setState({bookPageCurrent: e.target.value}); this.loaded = false;}}
                                       type="button">{item + 1}
                            </button>)
                    })
                    }
                    <br/>
                    <button onClick={() => window.location.assign('http://localhost:3000/admin/requests')} type="button">Requests</button>
                    <button onClick={() => {this.setState({getDeleted: !this.state.getDeleted, bookPageCurrent: 0,}); this.loaded = false;}}
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