import React, { Component } from 'react';
import {validateAdminConnection} from '../../Helpers/validators';
import BookSite from "../../Components/BookSite";
import {loadBook} from "../../Redux/adminActions"
import {connect} from "react-redux";

class AdminBook extends Component {
    state= {
        filter: '',
        usersSortByAsc: true,
        bookPageCurrent: 0,
        bookPagesCount: 0,
        getDeleted: false,
    };

    loaded = false;

    onLinkNameClick(id){
        window.location.assign(`http://localhost:3000/admin/userpageupdate/${id}`);
    }

    makePagination(){
        return Array.apply(null, {length: this.props.bookPagesCount}).map(Number.call, Number);
    }

    async onBookAllGet(){
        this.props.loadBook(this.props.sessionId, this.state.bookPageCurrent, this.state.filter, this.state.getDeleted, this.state.usersSortByAsc)
    };

    onExitButtonClick = async e => {
        window.location.assign('http://localhost:3000/admin/login');
    };

    render(){
        validateAdminConnection(this.props.sessionId);
            if (!this.loaded){
                this.onBookAllGet();
                this.loaded = true;
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
                    {this.props.bookData === null || this.props.bookData === undefined || this.props.bookData === []
                        ? <strong>Wait</strong>
                        : <BookSite callback={this.onLinkNameClick} book={this.props.bookData} id={'admin'}/>
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

const mapStateToProps = state => {
    console.log(state);
    return {
        bookData: state.admin.bookData,
        bookPagesCount: state.admin.bookPagesCount,
        sessionId: state.admin.sessionId,
    }
};

const mapDispatchToProps = {
    loadBook
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminBook);