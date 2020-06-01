import React, { Component } from 'react';
import {loadUserPage, requestAccess} from "../../Redux/actions";
import {connect} from "react-redux";
import {validateConnection} from "../../Helpers/validators";
import {Button, Error, Image} from "../../Styles";

class Page extends Component {
    loaded = false;

    onRequestAccess = async e => {
        this.props.requestAccess(this.props.sessionId, this.props.id)
    };

    async onPageGet() {
        this.props.loadUserPage(this.props.sessionId, this.props.id);
    }

    render(){
        validateConnection(this.props.sessionId);
            if (!this.loaded){
                this.onPageGet().then(() => this.loaded = true);
            }
            return (this.loaded === false
                ? <div>Wait</div>
                :
                <div>
                    <p>
                        <strong>Avatar:</strong>
                    </p>
                    {
                        this.props.avatarPath === ''
                            ? <p>No avatar</p>
                            : <Image src={this.props.avatarPath} alt={'avatar'}/>
                    }
                    <h1>Name: {this.props.name}</h1>
                    <p>Birth Date: {this.props.birthDate} </p>
                    <p>Work Phone: {this.props.workPhone}</p>
                    {this.props.privatePhone1 !== undefined
                        ? <p>Private Phone: {this.props.privatePhone1}</p>
                        : <p>Private Phone: Hidden</p>
                    }
                    {this.props.privatePhone2 !== undefined
                        ? <p>Private Phone 2: {this.props.privatePhone2}</p>
                        : <p>Private Phone 2: Hidden</p>
                    }
                    {this.props.privatePhone3 !== undefined
                        ? <p>Private Phone 3: {this.props.privatePhone3}</p>
                        : <p>Private Phone 3: Hidden</p>
                    }
                    <p>Position: {this.props.position === null ? '' : this.props.position}</p>
                    <p>Branch: {this.props.branch === null ? '' : this.props.branch}</p>
                    <p>Work Place: {this.props.workPlace === null ? '' : this.props.workPlace}</p>
                    <p>About: {this.props.about === null ? '' : this.props.about}</p>
                    <Button onClick={() => window.location.assign('http://localhost:3000/app/book')} type="button">Back</Button>
                    {this.props.privatePhone1 === undefined
                        ? <Button onClick={this.onRequestAccess} type="button">Request Access</Button>
                        : <br />
                    }
                    {this.props.answer !== ''
                        ? <Error>{this.props.answer}</Error>
                        :''
                    }
                </div>
            );
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(state);
    return {
        id: ownProps.match.params.id,
        name: state.user.name,
        birthDate: state.user.birthDate,
        branch: state.user.branch,
        workPhone: state.user.workPhone,
        position: state.user.position,
        workPlace: state.user.workPlace,
        privatePhone1: state.user.privatePhone1,
        privatePhone2: state.user.privatePhone2,
        privatePhone3: state.user.privatePhone3,
        about: state.user.about,
        avatar: state.user.avatar,
        avatarPath: state.user.avatarPath,
        sessionId: state.user.sessionId,
        answer: state.user.answer
    }
};

const mapDispatchToProps = {
    loadUserPage,
    requestAccess
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);