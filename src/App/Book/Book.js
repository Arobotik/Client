import React, { Component } from 'react';
import {validateConnection} from '../../Helpers/validators';
import BookSite from "../../Components/BookSite";
import {loadBook} from "../../Redux/actions";
import {connect} from "react-redux";

class Book extends Component {
    state = {
        filter: '',
        book: [],
        bookPageCurrent: 0,
        bookPagesCount: 0,
        usersSortByAsc: true,
    };

    loaded = false;

    async onBookAllGet(){
        this.props.loadBook(this.state.bookPageCurrent, this.state.filter, this.state.usersSortByAsc)
    };

    makePagination(){
        let arr = Array.apply(null, {length: this.props.bookPagesCount}).map(Number.call, Number);
        return arr !== undefined ? arr : [];
    }

    onLinkNameClick(id, isSameUser){
        if (isSameUser) {
            window.location.assign('http://localhost:3000/app/mypage');
        }
        else{
            window.location.assign(`http://localhost:3000/app/page/${id}`);
        }
    }


    onExitButtonClick = async e => {
        window.location.assign('http://localhost:3000/app/login');
    };


    render(){
        validateConnection(this.props.sessionId);
            if (!this.loaded){
                this.onBookAllGet().then(() => this.loaded = true);
            }
            return (
                <div className="Book">
                    <button onClick={e => this.onLinkNameClick(this.props.id, true)} type="button">My Page</button><br/>
                    <button onClick={() => {
                        this.setState({usersSortByAsc: !this.state.usersSortByAsc});
                        this.loaded = false;}}
                        type="button"
                    >
                        {this.props.usersSortByAsc
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
                    <strong>Users</strong>
                    {this.props.book === null || this.props.book === ''
                        ? <strong>None</strong>
                        : <BookSite callback={this.onLinkNameClick} book={this.props.book} id={this.props.id}/>
                    }
                    <br/>
                    {this.makePagination().map(item => {
                        return item === Number(this.props.bookPageCurrent)
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

const mapStateToProps = state => {
    console.log(state);
    return {
        book: state.user.book,
        bookPagesCount: state.user.bookPagesCount,
        sessionId: state.user.sessionId,
        id: state.user.id,
    }
};

const mapDispatchToProps = {
    loadBook
};

export default connect(mapStateToProps, mapDispatchToProps)(Book);