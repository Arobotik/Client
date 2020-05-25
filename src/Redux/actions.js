import {
    APP_BOOK_FAILED_LOAD,
    APP_BOOK_SUCCESSFUL_LOAD,
    APP_BRANCHES_LOAD,
    APP_CORRECT_LOGIN,
    APP_INCORRECT_LOGIN,
    APP_LOGIN,
    APP_MYPAGE_FAILED_LOAD,
    APP_MYPAGE_LASTVISITED_LOAD,
    APP_MYPAGE_REQUEST_FAILED_SET,
    APP_MYPAGE_REQUESTS_FAILED_LOAD,
    APP_MYPAGE_REQUESTS_SUCCESSFUL_LOAD,
    APP_MYPAGE_SUCCESSFUL_LOAD, APP_MYPAGEUPDATE_FAILED,
    APP_MYPAGEUPDATE_SUCCESSFUL,
    APP_USERPAGE_FAILED_LOAD,
    APP_USERPAGE_REQUEST_ACCESS,
    APP_USERPAGE_SUCCESSFUL_LOAD
} from "./types";
import {validateLogin, validateNewLoginData, validateNewUserData} from "../Helpers/validators";
import {
    getAllPages, getBranches,
    getLastVisited,
    getMyPage,
    getRequestAccess,
    getRequests,
    getUser,
    login,
    setRequestStatus, setUpdatedUserData
} from "../Helpers/fetches";
import Cookies from "js-cookie";

function makeUint8Array(data){
    let arr = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++ ) {
        arr[i] = data[i];
    }
    return arr;
}

export function onResetState(){
    return dispatch => {
        dispatch({type: APP_LOGIN})
    }
}

export function appLogin(_login, _password){
    return async dispatch => {
        if(validateLogin())
        {
            const body = await login(_login, _password);

            if (body.result === true) {
                window.location.assign('http://localhost:3000/app/book');
                Cookies.remove('login');
                Cookies.remove('password');
                dispatch({type: APP_CORRECT_LOGIN, payload: body})
            } else {
                dispatch({type: APP_INCORRECT_LOGIN, payload: {error: 'Incorrect Login or Password'}});
            }
        }
        else{
            dispatch({type: APP_INCORRECT_LOGIN, payload: {error: 'Check Login or Password'}});
        }
    };
}

export function loadBook(_bookPageCurrent, _filter, _usersSortByAsc){
    return async dispatch => {
        const body = await getAllPages(_bookPageCurrent, _filter, _usersSortByAsc,);
        if (body.express !== null) {
            dispatch({type: APP_BOOK_SUCCESSFUL_LOAD, payload: body})
        } else {
            dispatch({type: APP_BOOK_FAILED_LOAD, payload: {error: 'Failed to load Book data'}})
        }
    }
}

export function loadMyPage(_sessionId){
    return async dispatch => {
        const body = await getMyPage(_sessionId);

        if (body.result) {
            body.avatar = body.avatar !== null && body.avatar !== '' && body.avatar !== undefined
                ? new Blob([makeUint8Array(body.avatar)], {type: 'image/png'})
                : '';
            body.avatarPath = body.avatar !== '' ? URL.createObjectURL(body.avatar) : '';
            dispatch({type: APP_MYPAGE_SUCCESSFUL_LOAD, payload: body});
        } else {
            window.location.assign('http://localhost:3000/app/login');
            dispatch({type: APP_MYPAGE_FAILED_LOAD, payload: {error: 'Failed to load user page'}})
        }
    }
}

export function getMyRequests(_sessionId){
    return async dispatch => {
        const body = await getRequests(_sessionId);
        if (body.result === true) {
            dispatch({type: APP_MYPAGE_REQUESTS_SUCCESSFUL_LOAD,  payload: body});
        } else {
            dispatch({type: APP_MYPAGE_REQUESTS_FAILED_LOAD, payload: {error: 'Failed to load user requests'}})
        }

    }
}

export function getMyLastVisited(_sessionId){
    return async dispatch => {
        const body = await getLastVisited(_sessionId);
        console.log('lastVisited', body.express);
        dispatch({ type: APP_MYPAGE_LASTVISITED_LOAD,  payload: body});
    }
}

export function setRequest(_sessionId, _requesting, _status){
    return async dispatch => {
        const body = await setRequestStatus(_sessionId, _requesting, _status);
        if (body.result === false){
            dispatch({ type: APP_MYPAGE_REQUEST_FAILED_SET,  payload: {error: 'Failed to update request status'}});
        }
        dispatch({type: '__REQUEST_SET__'})
    }
}

export function loadUserPage(sessionId, userId) {
    return async dispatch => {
        const body = await getUser(sessionId, userId);

        if (body.result) {
            body.avatar = body.avatar !== null && body.avatar !== '' && body.avatar !== undefined
                ? new Blob([makeUint8Array(body.avatar)], {type: 'image/png'})
                : '';
            body.avatarPath = body.avatar !== '' ? URL.createObjectURL(body.avatar) : '';
            dispatch({type: APP_USERPAGE_SUCCESSFUL_LOAD, payload: body});
        } else {
            window.location.assign('http://localhost:3000/app/login');
            dispatch({type: APP_USERPAGE_FAILED_LOAD, payload: {error: 'Failed to load user page'}})
        }
    };
}

export function requestAccess(_sessionId, _id) {
    return async dispatch => {
        const body = await getRequestAccess(_sessionId, _id);
        let answer = '';
        switch (body.requested){
            case 0:
                answer = 'Requestion already sended';
                break;
            case 2:
                answer = 'Requestion sended';
                break;
            default:
                answer = 'Requestion already rejected';
        }
        dispatch({type: APP_USERPAGE_REQUEST_ACCESS, payload: {answer: answer}})
    }
}

export function loadBranches(){
    return async dispatch => {
        const body = await getBranches();
        dispatch({ type: APP_BRANCHES_LOAD,  payload: body});
    }
}

export function updateUserPage(state, canvas){
    return async dispatch => {
        validateNewLoginData(state, state.oldLogin.toLowerCase() !== state.login.toLowerCase())
            .then(result => {
                switch (result){
                    case 0:
                        return '';
                    case 1:
                        return 'Password should contains only A-Z, a-z, 0-9 and at least one of each of them';
                    case 2:
                        return 'Password should contains at least 8 and not more then 16 symbols';
                    case 3:
                        return 'Login is incorrect';
                    default:
                        return 'Login is already occupied';
                }
            }).then((result) => {
            if (result.toString() === ''){
                validateNewUserData(state).then(async result  =>  {
                    let error = '';
                    switch (result) {
                        case 0:
                            state.avatar = canvas !== null ? canvas.toBlob() : null;
                            await setUpdatedUserData(state);
                            alert('Successfully modified');
                            window.location.assign('http://localhost:3000/app/mypage');
                            dispatch({type: APP_MYPAGEUPDATE_SUCCESSFUL, payload: state});
                            return;
                        case 1:
                            error = 'Field Name must be filled';
                            break;
                        case 2:
                            error = 'Work Phone must be correct work Number';
                            break;
                        case 3:
                            error = 'Field Number must be correct private Number';
                            break;
                        case 4:
                            error = 'If you want to fill more private Numbers, they must be correct';
                            break;
                        default:
                            error = 'Incorrect Birth Date';
                    }
                    if (error !== ''){
                        alert(error);
                        dispatch({type: APP_MYPAGEUPDATE_FAILED, payload: {error: error}});
                    }
                });
            }
            else{
                dispatch({type: APP_MYPAGEUPDATE_FAILED, payload: {error: result}});
            }
        });
    }
}