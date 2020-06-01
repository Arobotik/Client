import React, { Component } from 'react';
import Canvas from "../../Components/Canvas";
import {validateConnection} from '../../Helpers/validators';
import {loadBranches, loadMyPage, updateUserPage} from "../../Redux/actions";
import {connect} from "react-redux";
import {Button, Error, Input, InputElementStyled, Select} from "../../Styles";

let globalVar;

class MyPageUpdate extends Component {
    state = {
        avatarPath: '',
    };

    componentDidMount(){
        globalVar = {};
        globalVar.callback = (state) => {
            this.updateState(state);
        };
    }

    updateState(state){
        if (state !== undefined) {
            this.setState({
                id: state.userId,
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
                error: state.error
            });
            this.imageChange(this.canvasEditRef);
        }
    }

    async onGetAllBranches(){
        this.props.loadBranches();
    }

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

    onPersonPageDataChange = async e =>{
        e.preventDefault();
        this.props.updateUserPage(this.state, this.canvasEditRef.current)
    };

    loaded = false;

    async onGetMyPage(){
        this.props.loadMyPage(this.props.sessionId);
    }

    canvasEditRef = React.createRef();

    render() {
        validateConnection(this.props.sessionId);
        if (!this.loaded) {
            this.onGetAllBranches();
            this.onGetMyPage().then(() => this.updateState());
            this.loaded = true;
        }
        return (
            <div className="PersonsChangePage">
                <form onSubmit={this.onPersonPageDataChange}>
                    <h1>
                        <strong>Data changing:</strong>
                    </h1>
                    <p>
                        <strong>Login:</strong>
                    </p>
                    <Input
                        type="text"
                        value={this.state.login ? this.state.login : ''}
                        name={"login"}
                        onChange={this.changeInputHandler}
                        maxLength={25}
                    />
                    <p>
                        <strong>Password:</strong>
                    </p>
                    <Input
                        type="password"
                        value={this.state.password ? this.state.password : ''}
                        name={"password"}
                        onChange={this.changeInputHandler}
                        maxLength={25}
                    /><br/>
                    <p>
                        <strong>*Name:</strong>
                    </p>
                    <Input
                        type="text"
                        value={this.state.name ? this.state.name : ''}
                        name={"name"}
                        onChange={this.changeInputHandler}
                        maxLength={60}
                    />
                    <p>
                        <strong>*Birth Date:</strong>
                    </p>
                    <Input
                        type="date"
                        value={this.state.birthDate ? this.state.birthDate : ''}
                        name={"birthDate"}
                        onChange={this.changeInputHandler}
                    />
                    <input
                        type="checkbox"
                        checked={this.state.hideYear ? this.state.login : false}
                        onChange={e => this.setState({hideYear: e.target.checked})}
                    />Hide Year<br/>
                    <p>
                        <strong>*Work Phone:</strong>
                    </p>
                    <InputElementStyled
                        mask="+7(999)999-99-99"
                        value={this.state.workPhone ? this.state.workPhone : ''}
                        name={"workPhone"}
                        onChange={this.changeInputHandler}
                        placeholder="Work Phone" ref="workPhone"
                    />
                    <p>
                        <strong>*Private Phone:</strong>
                    </p>
                    <InputElementStyled
                        mask="+7(999)999-99-99"
                        value={this.state.privatePhone1 ? this.state.privatePhone1 : ''}
                        name={"privatePhone1"}
                        onChange={this.changeInputHandler}
                        placeholder="Private Phone 1" ref="privatePhone1"
                    />
                    <p>
                        <strong>Additional private Phones:</strong>
                    </p>
                    <InputElementStyled
                        mask="+7(999)999-99-99"
                        value={this.state.privatePhone2 ? this.state.privatePhone2 : ''}
                        name={"privatePhone2"}
                        onChange={this.changeInputHandler}
                        placeholder="Private Phone 2" ref="privatePhone2"
                    /><br/>
                    <InputElementStyled
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
                        <Select
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
                        </Select>
                    </p>
                    <p>
                        <strong>Position:</strong>
                    </p>
                    <Input
                        type="text"
                        value={this.state.position === null ? '' : this.state.position ? this.state.position : ''}
                        name={"position"}
                        onChange={this.changeInputHandler}
                        maxLength={20}
                    />
                    <p>
                        <strong>Work Place:</strong>
                    </p>
                    <Input
                        type="text"
                        value={this.state.workPlace === null ? '' : this.state.workPlace ? this.state.workPlace : ''}
                        name={"workPlace"}
                        onChange={this.changeInputHandler}
                        maxLength={20}
                    />
                    <p>
                        <strong>About:</strong>
                    </p>
                    <Input
                        type="text"
                        value={this.state.about === null ? '' : this.state.about ? this.state.about : ''}
                        name={"about"}
                        onChange={this.changeInputHandler}
                        maxLength={100}
                    /><br/>
                    <p>
                        <strong>Avatar:</strong>
                    </p>
                    <input
                        type="file"
                        id={"avatar"}
                        onChange={e => {
                            this.setState({
                                avatar: e.target.files[0],
                                avatarPath: URL.createObjectURL(e.target.files[0])
                            });
                        }}
                    />
                    <button onClick={e => this.imageChange(this.canvasEditRef)} type="button">Load</button>
                    <br/>
                    {
                        this.state.avatar === '' || this.state.avatar === undefined
                            ? <p>No avatar</p>
                            : <Canvas avatarPath={this.state.avatarPath} ref={this.canvasEditRef}/>
                    }
                    <Button type="submit">Confirm</Button>
                    <Button onClick={() => window.location.assign('http://localhost:3000/app/mypage')}
                            type="button">Back
                    </Button>
                    <br/>
                </form>
                {this.props.error !== ''
                    ? <Error style={{color: "red"}}>{this.props.error}</Error>
                    : ''
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    console.log(state);
    if (globalVar !== undefined){
        globalVar.callback(state.user);
    }
    return {
        id: state.user.userId,
        name: state.user.name,
        login: state.user.login,
        oldLogin: state.user.login,
        password: state.user.password,
        birthDate: state.user.birthDate,
        branch: state.user.branch,
        workPhone: state.user.workPhone,
        position: state.user.position,
        workPlace: state.user.workPlace,
        privatePhone1: state.user.privatePhone1,
        privatePhone2: state.user.privatePhone2,
        privatePhone3: state.user.privatePhone3,
        hideYear: state.user.hideYear,
        hidePhones: state.user.hidePhones,
        about: state.user.about,
        sessionId: state.user.sessionId,
        branches: state.user.branches,
        error: state.user.error
    }
};

const mapDispatchToProps = {
    loadMyPage,
    loadBranches,
    updateUserPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPageUpdate);