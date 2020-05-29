import React from "react";
import {Button, List} from "../Styles";

class BookSite extends React.Component {

    render(){
        return(
            <div className="List">
                <List>{
                    this.props.book && this.props.id ? this.props.book.map(item => {
                        return <li key={item[0]}>
                            <Button onClick={() => this.props.callback(item[0], item[0] === this.props.id)}>{item[1]}</Button>
                        </li>
                    })
                        : ''
                }</List>
            </div>
        )
    }
}

export default BookSite;