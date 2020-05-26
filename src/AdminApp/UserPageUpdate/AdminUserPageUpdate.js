import React, { Component } from 'react';
import Canvas from "../../Components/Canvas";
import {validateAdminConnection} from '../../Helpers/validators';
import InputElement from "react-input-mask";
import {loadBranches, loadUser, updateUserPage, deleteUserPage} from "../../Redux/adminActions";
import {connect} from "react-redux";

let globalVar;

class AdminUserPageUpdate extends Component {
    state = {id: -1,};

    componentDidMount() {
        this.setState({id: this.props.match.params.id,});
        globalVar = {};
        globalVar.callback = (state) => {
            this.updateState(state);
        };
    }

    updateState(state){
        if (state !== undefined) {
            this.setState({
                name: state.name,
                login: state.login,
                oldLogin: state.login,
                password: state.password,
                birthDate: state.birthDate,
                branch: state.branch,
                workPhone: state.workPhone,
                position: state.position,
                workPlace: state.workPlace,
                privatePhone1: state.privatePhone1,
                privatePhone2: state.privatePhone2,
                privatePhone3: state.privatePhone3,
                hideYear: state.hideYear,
                hidePhones: state.hidePhones,
                about: state.about,
                avatar: state.avatar !== undefined ? (state.avatar.__proto__ === Blob.prototype ? state.avatar : '') : '',
                avatarPath: state.avatarPath,
                sessionId: state.sessionId,
                branches: state.branches,
                error: state.error,
                deleted: state.deleted
            });
            this.imageChange(this.canvasUserRef);
        }
    }

    async onGetAllBranches(){
        this.props.loadBranches();
    }

    async onUserDataGet(){
        this.props.loadUser(this.props.sessionId, this.props.id);
        this.loaded = true;
    };

    onPersonPageDataChange = async e =>{
        e.preventDefault();
        this.state.correctLogin = false;
        this.props.updateUserPage(this.props.sessionId, this.canvasUserRef.current, this.state);
        this.loaded = false;
    };

    async onDeleteUser(deleted){
        this.props.deleteUserPage(this.props.sessionId, this.props.id, deleted);
        this.state.correctLogin = false;
    }

    canvasUserRef = React.createRef();

    imageChange(canvas){
        if (canvas.current !== null){
            canvas.current.changeImage(this.state.avatarPath);
        }
    };

    changeInputHandler = e =>{
        e.persist();
        this.setState(prev => ({...prev, ...{
                [e.target.name]: e.target.value
            }}))
    };

    render(){
        validateAdminConnection(this.props.sessionId);
        if (!this.loaded){
            this.onUserDataGet();
            this.onGetAllBranches();
        }
        return(
            <div className="PersonsPage">
                <form onSubmit={this.onPersonPageDataChange}>
                    <h1>
                        <strong>Data change: {this.state.getDeleted ? '(Deleted)' : ''}</strong>
                    </h1>
                    <p>
                        <strong>Login:</strong>
                    </p>
                    <input
                        type="text"
                        value={this.state.login ? this.state.login : ''}
                        name={"login"}
                        onChange={this.changeInputHandler}
                    />
                    <p>
                        <strong>Password:</strong>
                    </p>
                    <input
                        type="text"
                        value={this.state.password ? this.state.password : ''}
                        name={"password"}
                        onChange={this.changeInputHandler}
                    /><br/>
                    <p>
                        <strong>*Name:</strong>
                    </p>
                    <input
                        type="text"
                        value={this.state.name ? this.state.name : ''}
                        name={"name"}
                        onChange={this.changeInputHandler}
                    />
                    <p>
                        <strong>*Birth Date:</strong>
                    </p>
                    <input
                        type="date"
                        value={this.state.birthDate ? this.state.birthDate : ''}
                        name={"birthDate"}
                        onChange={this.changeInputHandler}
                    />
                    <input
                        type="checkbox"
                        checked={this.state.hideYear ? this.state.hideYear : false}
                        onChange={e => this.setState({hideYear: e.target.checked})}
                    />Hide Year<br/>
                    <p>
                        <strong>*Work Phone:</strong>
                    </p>
                    <InputElement
                        mask="+7(999)999-99-99"
                        value={this.state.workPhone ? this.state.workPhone : ''}
                        name={"workPhone"}
                        onChange={this.changeInputHandler}
                        placeholder="Work Phone" ref="workPhone"
                    />
                    <p>
                        <strong>*Private Phone:</strong>
                    </p>
                    <InputElement
                        mask="+7(999)999-99-99"
                        value={this.state.privatePhone1 ? this.state.privatePhone1 : ''}
                        name={"privatePhone1"}
                        onChange={this.changeInputHandler}
                        placeholder="Private Phone 1" ref="privatePhone1"
                    />
                    <p>
                        <strong>Additional private Phones:</strong>
                    </p>
                    <InputElement
                        mask="+7(999)999-99-99"
                        value={this.state.privatePhone2 ? this.state.privatePhone2 : ''}
                        name={"privatePhone2"}
                        onChange={this.changeInputHandler}
                        placeholder="Private Phone 2" ref="privatePhone2"
                    /><br/>
                    <InputElement
                        mask="+7(999)999-99-99"
                        value={this.state.privatePhone3 ? this.state.privatePhone3 : ''}
                        name={"privatePhone3"}
                        onChange={this.changeInputHandler}
                        placeholder="Private Phone 3" ref="privatePhone3"
                    />
                    <input
                        type="checkbox"
                        checked={this.state.hidePhones ? this.state.hidePhones : false}
                        onChange={e => this.setState({hidePhones: e.target.checked})}
                    />Hide Phones<br/>
                    <p>
                        <strong>Branch:</strong>
                    </p>
                    <p>
                        <select
                            value={this.state.branch !== '' && this.state.branch !== 'None'
                                ? this.state.branch
                                : ''
                            }
                            onChange={e => this.setState({branch: e.target.value})}
                        >
                            <option disabled>Choose branch...</option>
                            <option value={'None'} key={-1}>None</option>
                            {this.props.branches === [] || this.props.branches === null || this.props.branches === undefined
                                ? ''
                                : this.props.branches.map(item => {
                                    return <option value={item[1]} key={item[0]}>{item[1]}</option>
                                })
                            }
                        </select>
                    </p>
                    <p>
                        <strong>Position:</strong>
                    </p>
                    <input
                        type="text"
                        value={this.state.position === null ? '' : this.state.position ? this.state.position : ''}
                        name={"position"}
                        onChange={this.changeInputHandler}
                    />
                    <p>
                        <strong>Work Place:</strong>
                    </p>
                    <input
                        type="text"
                        value={this.state.workPlace === null ? '' : this.state.workPlace ? this.state.workPlace : ''}
                        name={"workPlace"}
                        onChange={this.changeInputHandler}
                    />
                    <p>
                        <strong>About:</strong>
                    </p>
                    <input
                        type="text"
                        value={this.state.about === null ? '' : this.state.about ? this.state.about : ''}
                        name={"about"}
                        onChange={this.changeInputHandler}
                    /><br/>
                    <p>
                        <strong>Avatar:</strong>
                    </p>
                    <input
                        type="file"
                        id={"avatar"}
                        onChange={e => {
                            this.setState({avatar: e.target.files[0], avatarPath: URL.createObjectURL(e.target.files[0])});
                        }}
                    />
                    <button onClick={() => this.imageChange(this.canvasUserRef)} type="button">Load</button><br/>
                    {
                        this.state.avatarPath === ''
                            ? <p>No avatar</p>
                            : <Canvas avatarPath={this.state.avatarPath} ref={this.canvasUserRef}/>
                    }
                    <button type="submit">Confirm</button>
                    {
                        this.state.deleted
                            ? <button onClick={() => this.onDeleteUser(false)} type="button">Undelete</button>
                            : <button onClick={() => this.onDeleteUser(true)} type="button">Delete</button>
                    }
                    <button onClick={() => window.location.assign('http://localhost:3000/admin/book')} type="button">Back</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(state);
    if (globalVar !== undefined){
        globalVar.callback(state.admin);
    }
    return {
        id: ownProps.match.params.id,
        name: state.admin.name,
        login: state.admin.login,
        oldLogin: state.admin.login,
        password: state.admin.password,
        birthDate: state.admin.birthDate,
        branch: state.admin.branch,
        workPhone: state.admin.workPhone,
        position: state.admin.position,
        workPlace: state.admin.workPlace,
        privatePhone1: state.admin.privatePhone1,
        privatePhone2: state.admin.privatePhone2,
        privatePhone3: state.admin.privatePhone3,
        hideYear: state.admin.hideYear,
        hidePhones: state.admin.hidePhones,
        about: state.admin.about,
        sessionId: state.admin.sessionId,
        branches: state.admin.branches,
        error: state.admin.error
    }
};

const mapDispatchToProps = {
    loadUser,
    loadBranches,
    updateUserPage,
    deleteUserPage
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminUserPageUpdate);