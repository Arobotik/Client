import {
    ADMIN_BOOK_FAILED_LOAD,
    ADMIN_BOOK_SUCCESSFUL_LOAD,
    ADMIN_BRANCHES_FAILED_EDIT,
    ADMIN_BRANCHES_FAILED_LOAD,
    ADMIN_BRANCHES_SUCCESSFUL_EDIT,
    ADMIN_BRANCHES_SUCCESSFUL_LOAD,
    ADMIN_CORRECT_LOGIN,
    ADMIN_INCORRECT_LOGIN,
    ADMIN_LOGIN,
    ADMIN_REQUESTS_FAILED_EDIT,
    ADMIN_REQUESTS_FAILED_LOAD,
    ADMIN_REQUESTS_SUCCESSFUL_EDIT,
    ADMIN_REQUESTS_SUCCESSFUL_LOAD, ADMIN_USERPAGE_FAILED_DELETE,
    ADMIN_USERPAGE_FAILED_LOAD,
    ADMIN_USERPAGE_FAILED_UPDATE,
    ADMIN_USERPAGE_SUCCESSFUL_DELETE,
    ADMIN_USERPAGE_SUCCESSFUL_LOAD,
    ADMIN_USERPAGE_SUCCESSFUL_UPDATE,
} from "./types";
import {
    deleteUser,
    getAllPages,
    getAllRequests,
    getUserData,
    login,
    setAdminRequest,
    setBranchesUpdate, setUserDataUpdate
} from "../Helpers/adminFetches";
import Cookies from "js-cookie";
import {getBranches} from "../Helpers/fetches";

function makeUint8Array(data){
    let arr = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++ ) {
        arr[i] = data[i];
    }
    return arr;
}

export function onResetState(){
    return dispatch => {
        dispatch({type: ADMIN_LOGIN})
    }
}

export function loadBook(sessionId, bookPageCurrent, filter, deleted, usersSortByAsc){
    return async dispatch => {
        const body = await getAllPages(sessionId, bookPageCurrent, filter, deleted, usersSortByAsc);
        if (body.express !== null){
            dispatch({type: ADMIN_BOOK_SUCCESSFUL_LOAD, payload: body});
        }
        else{
            dispatch({type: ADMIN_BOOK_FAILED_LOAD, payload: {error: 'Failed to load book data'}});
        }
    }
}

export function loadBranches(sortByAsc){
    return async dispatch => {
        const body = await getBranches(sortByAsc);
        if (body.result === 'error'){
            window.location.assign('http://localhost:3000/admin/login');
            dispatch({type: ADMIN_BRANCHES_FAILED_LOAD, payload: {error: 'Failed to load branches data'}});
        }
        else {
            dispatch({type: ADMIN_BRANCHES_SUCCESSFUL_LOAD, payload: body});
        }
    }
}

export function updateBranches(sessionId, branches){
    return async dispatch => {
        const body = await setBranchesUpdate(sessionId, branches);
        if (body.result === true){
            dispatch({type: ADMIN_BRANCHES_SUCCESSFUL_EDIT,});
        }
        else{
            dispatch({type: ADMIN_BRANCHES_FAILED_EDIT, payload: {error: 'Error in branches edit'}});
        }
    }
}

export function loadRequests(sessionId, requestsPageCurrent, requestsSortByAsc, requestsShowWithStatus){
    return async dispatch => {
        const body = await getAllRequests(sessionId, requestsPageCurrent, requestsSortByAsc, requestsShowWithStatus);
        if (body.result === true){
            dispatch({type: ADMIN_REQUESTS_SUCCESSFUL_LOAD, payload: body});
        }
        else {
            dispatch({type: ADMIN_REQUESTS_FAILED_LOAD, payload: {error: 'Error in getting requests'}});
        }
    }
}

export function loadUser(sessionId, id){
    return async dispatch => {
        const body = await getUserData(sessionId, id);

        if (body.result) {
            body.avatar = body.avatar !== null && body.avatar !== '' && body.avatar !== undefined
                ? new Blob([makeUint8Array(body.avatar)], {type: 'image/png'})
                : '';
            body.avatarPath = body.avatar !== '' ? URL.createObjectURL(body.avatar) : '';
            dispatch({type: ADMIN_USERPAGE_SUCCESSFUL_LOAD, payload: body});
        } else {
            window.location.assign('http://localhost:3000/admin/login');
            dispatch({type: ADMIN_USERPAGE_FAILED_LOAD, payload: {error: 'Failed to load user page'}})
        }
    }
}

export function updateRequests(sessionId, target, requesting, status){
    return async dispatch => {
        const body = await setAdminRequest(sessionId, target, requesting, status);
        if (body.result === false){
            dispatch({type: ADMIN_REQUESTS_FAILED_EDIT, payload: {error: 'Error in request changing'}});
        }
        else{
            dispatch({type: ADMIN_REQUESTS_SUCCESSFUL_EDIT,});
        }
    }
}

export function updateUserPage(sessionId, canvas, state){
    return async dispatch => {
        let avatar = canvas !== null ? canvas.toBlob() : null;
        const body = await setUserDataUpdate(sessionId, state, avatar);
        if (body.result)
        {
            alert('Successfully modified');
            dispatch({type: ADMIN_USERPAGE_SUCCESSFUL_UPDATE});
        }
        else
        {
            dispatch({type: ADMIN_USERPAGE_FAILED_UPDATE, payload: {error: 'Error in userpage updating'}});
        }
    }
}

export function deleteUserPage(sessionId, id, deleted){
    return async dispatch => {
        const body = await deleteUser(sessionId, id, deleted);
        if (body.result === true) {
            dispatch({type: ADMIN_USERPAGE_SUCCESSFUL_DELETE, payload: {deleted: deleted}});
        } else {
            dispatch({type: ADMIN_USERPAGE_FAILED_DELETE, payload: {error: 'Error in userpage deleted state change'}});
        }
    }
}

export function adminLogin(_login, _password){
    return async dispatch => {
        const body = await login(_login, _password);

        if (body.result === true) {
            window.location.assign('http://localhost:3000/admin/book');
            Cookies.remove('login');
            Cookies.remove('password');
            dispatch({type: ADMIN_CORRECT_LOGIN, payload: body})
        } else {
            dispatch({type: ADMIN_INCORRECT_LOGIN, payload: {error: 'Incorrect Login or Password'}});
        }
    }
}