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
    ADMIN_REQUESTS_SUCCESSFUL_LOAD
} from "./types";
import {getAllPages, getAllRequests, login, setAdminRequest, setBranchesUpdate} from "../Helpers/adminFetches";
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

export function adminLogin(_login, _password){
    return async dispatch => {
        const body = await login(_login, _password);

        if (body.result === true) {
            /////////////
            Cookies.set('sessionId', body.sessionId);
            /////////////
            window.location.assign('http://localhost:3000/admin/book');
            Cookies.remove('login');
            Cookies.remove('password');
            dispatch({type: ADMIN_CORRECT_LOGIN, payload: body})
        } else {
            dispatch({type: ADMIN_INCORRECT_LOGIN, payload: {error: 'Incorrect Login or Password'}});
        }
    }
}