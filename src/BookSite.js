import React from "react";

class BookSite extends React.Component {

    render(){
        return(
            <div className="List">
                <ul>{
                    this.props.book.map(item => {
                        return <li key={item[0]}>
                            <button onClick={() => this.props.callback(item[0], item[0] === this.props.thisId)}>{item[1]}</button>
                        </li>
                    })
                }</ul>
            </div>
        )
    }
}

export default BookSite;