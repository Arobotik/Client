import React, { Component } from 'react';
import Canvas from "./Canvas";
import {validateAdminConnection} from './validators';
import {getUserData, setUserDataUpdate, deleteUser} from "./adminFetches";
import {getBranches} from "./fetches";
import InputElement from "react-input-mask";

class AdminUserPageUpdate extends Component {
    state = {id: -1,};

    componentDidMount() {
        this.setState({id: this.props.match.params.id,});
    }

    async onGetAllBranches(){
        const body = await getBranches();

        this.setState({branches: body.express});
    }

    async onUserDataGet(){
        const body = await getUserData(this.state.id);
        let avatar = body.avatar !== null && body.avatar !== '' && body.avatar !== undefined
            ? new Blob([this.makeUint8Array(body.avatar)], {type: 'image/png'})
            : '';
        this.setState({
            login: body.login,
            password: body.password,
            name: body.name,
            birthDate: body.birthDate,
            branch: body.branch,
            workPhone: body.workPhone,
            position: body.position,
            workPlace: body.workPlace,
            privatePhone1: body.privatePhone1,
            privatePhone2: body.privatePhone2,
            privatePhone3: body.privatePhone3,
            hideYear: body.hideYear,
            hidePhones: body.hidePhones,
            about: body.about,
            deleted: body.deleted,
            avatar: avatar,
            avatarPath: avatar !== '' ? URL.createObjectURL(avatar) : '',
            thisUserLogin: body.login,
            thisUserPassword: body.password
        });
        this.loaded = true;
    };

    makeUint8Array(data){
        let arr = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++ ) {
            arr[i] = data[i];
        }
        return arr;
    }

    onPersonPageDataChange = async e =>{
        e.preventDefault();
        let avatar = this.canvasUserRef.current !== null ? this.canvasUserRef.current.toBlob() : null;
        await setUserDataUpdate(this.state, avatar).then(()=>{
            this.state.correctLogin = false;
            this.setState({avatar: avatar});
        });
        alert('Successfully modified');
    };

    async onDeleteUser(deleted){
        const body = await deleteUser(this.state.id, deleted);
        if (body.result === true){
            this.state.correctLogin = false;
            this.setState({deleted: deleted});
        }
        else{
            alert('Error in action');
        }
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
        validateAdminConnection();
        if (!this.loaded){
            this.onUserDataGet().then(() => this.onGetAllBranches());
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
                            {this.state.branches === [] || this.state.branches === null || this.state.branches === undefined
                                ? ''
                                : this.state.branches.map(item => {
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

export default AdminUserPageUpdate;