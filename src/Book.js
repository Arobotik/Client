import React, { Component } from 'react';
import Cookies from 'js-cookie';
import {validateConnection} from './validators';
import {getAllPages} from "./fetches";

class Book extends Component {
    state = {
        filter: '',
        book: [],
        bookPageCurrent: 0,
        bookPagesCount: 0,
        thisId: Cookies.get('userId'),
    };

    loaded = false;

    async onBookAllGet(){
        const body = await getAllPages(this.state.bookPageCurrent, this.state.filter);
        if (body.express !== null){
            this.setState({book: body.express, bookPagesCount: body.pageCount});
            this.loaded = true;
        }
        else{
            this.setState({book: [], bookPagesCount: 0});
        }
    };

    makePagination(){
        return Array.apply(null, {length: this.state.bookPagesCount}).map(Number.call, Number);
    }

    onLinkNameClick(id){
        if (id === this.state.thisId) {
            window.location.assign('http://localhost:3000/app/mypage');
        }
        else{
            window.location.assign(`http://localhost:3000/app/page/${id}`);
        }
    }


    onExitButtonClick = async e => {
        Cookies.remove('userId');
        Cookies.remove('pageId');
        Cookies.remove('sessionId');
        window.location.assign('http://localhost:3000/app/login');
    };


    render(){
        validateConnection();
            if (!this.loaded){
                this.onBookAllGet().then(() => this.loaded = true);
            }
            return (
                <div className="Book">
                    <button onClick={e => this.onLinkNameClick(this.state.thisId)} type="button">My Page</button><br/>
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
                    <strong>Users</strong>
                    {this.state.book === null || this.state.book === ''
                        ? <strong>None</strong>
                        : <ul>{
                            this.state.book.map(item => {
                                return <li key={item[0]}>
                                    <button onClick={() => this.onLinkNameClick(item[0])}>{item[1]}</button>
                                </li>
                            })
                        }</ul>
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
                    <button onClick={this.onExitButtonClick} type="button">Exit</button>
                </div>
            )
        }
}

export default Book;