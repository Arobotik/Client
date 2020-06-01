import {
    APP_BOOK_FAILED_LOAD,
    APP_BOOK_SUCCESSFUL_LOAD,
    APP_BRANCHES_LOAD,
    APP_CORRECT_LOGIN,
    APP_INCORRECT_LOGIN,
    APP_LOGIN,
    APP_MYPAGE_FAILED_LOAD,
    APP_MYPAGE_LASTVISITED_LOAD,
    APP_MYPAGE_REQUESTS_FAILED_LOAD,
    APP_MYPAGE_REQUESTS_SUCCESSFUL_LOAD,
    APP_MYPAGE_SUCCESSFUL_LOAD, APP_MYPAGEUPDATE_FAILED,
    APP_MYPAGEUPDATE_SUCCESSFUL,
    APP_USERPAGE_FAILED_LOAD,
    APP_USERPAGE_REQUEST_ACCESS,
    APP_USERPAGE_SUCCESSFUL_LOAD
} from "./types";

const initialState = {
    id: '',
    name: '',
    login: '',
    password: '',
    birthDate: '',
    workPhone: '',
    position: '',
    privatePhone1: '',
    privatePhone2: '',
    privatePhone3: '',
    hideYear: false,
    hidePhones: false,
    branch: '',
    workPlace: '',
    oldLogin: '',
    about: '',
    avatar: '',
    avatarPath: '',
    sessionId: '',
    requests: [],
    lastVisited: [],
    branches: [],
};

export const userReducer = (state = initialState, action) => {
    switch(action.type){
        case APP_LOGIN:{
            return {...initialState, error: state?.error};
        }
        case APP_CORRECT_LOGIN:{
            return {...state, login: '', password: '', sessionId: action.payload.sessionId, id: action.payload.id}
        }
        case APP_BOOK_SUCCESSFUL_LOAD:{
            return {...state, book: action.payload.express, bookPagesCount: action.payload.pageCount}
        }
        case APP_MYPAGE_SUCCESSFUL_LOAD:{
            return {
                ...state,
                userId: action.payload.id,
                name: action.payload.name,
                login: action.payload.login,
                password: action.payload.password,
                birthDate: action.payload.birthDate,
                branch: action.payload.branch,
                workPhone: action.payload.workPhone,
                position: action.payload.position,
                workPlace: action.payload.workPlace,
                privatePhone1: action.payload.privatePhone1,
                privatePhone2: action.payload.privatePhone2,
                privatePhone3: action.payload.privatePhone3,
                hideYear: action.payload.hideYear,
                hidePhones: action.payload.hidePhones,
                carouselPage: 0,
                about: action.payload.about,
                avatar: action.payload.avatar,
                avatarPath: action.payload.avatarPath,
                error: ''
            }
        }
        case APP_MYPAGE_REQUESTS_SUCCESSFUL_LOAD:{
            return {...state, requests: action.payload.express}
        }
        case APP_MYPAGE_LASTVISITED_LOAD:{
            return {...state, lastVisited: action.payload.express}
        }
        case APP_USERPAGE_SUCCESSFUL_LOAD:{
            return {
                ...state,
                userId: action.payload.id,
                name: action.payload.name,
                birthDate: action.payload.birthDate,
                branch: action.payload.branch,
                workPhone: action.payload.workPhone,
                position: action.payload.position,
                workPlace: action.payload.workPlace,
                privatePhone1: action.payload.privatePhone1,
                privatePhone2: action.payload.privatePhone2,
                privatePhone3: action.payload.privatePhone3,
                about: action.payload.about,
                avatar: action.payload.avatar,
                avatarPath: action.payload.avatarPath,
                answer: '',
            }
        }
        case APP_USERPAGE_REQUEST_ACCESS:{
            return {...state, answer: action.payload.answer}
        }
        case APP_BRANCHES_LOAD:{
            return {...state, branches: action.payload.express}
        }
        case APP_MYPAGEUPDATE_SUCCESSFUL:{
            return {
                ...state,
                userId: action.payload.id,
                name: action.payload.name,
                login: action.payload.login,
                password: action.payload.password,
                birthDate: action.payload.birthDate,
                branch: action.payload.branch,
                workPhone: action.payload.workPhone,
                position: action.payload.position,
                workPlace: action.payload.workPlace,
                privatePhone1: action.payload.privatePhone1,
                privatePhone2: action.payload.privatePhone2,
                privatePhone3: action.payload.privatePhone3,
                hideYear: action.payload.hideYear,
                hidePhones: action.payload.hidePhones,
                about: action.payload.about,
                avatar: action.payload.avatar,
                avatarPath: action.payload.avatarPath,
                error: '',
            }
        }
        case APP_USERPAGE_FAILED_LOAD:
        case APP_MYPAGE_FAILED_LOAD:
        case APP_BOOK_FAILED_LOAD:
        case APP_INCORRECT_LOGIN:
        case APP_MYPAGE_REQUESTS_FAILED_LOAD:
        case APP_MYPAGEUPDATE_FAILED:{
            return {...state, error: action.payload.error}
        }
        default: {
            return state;
        }
    }
};