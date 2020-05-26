import {
    ADMIN_BOOK_FAILED_LOAD,
    ADMIN_BOOK_SUCCESSFUL_LOAD,
    ADMIN_BRANCHES_FAILED_EDIT,
    ADMIN_BRANCHES_FAILED_LOAD,
    ADMIN_BRANCHES_SUCCESSFUL_LOAD,
    ADMIN_CORRECT_LOGIN,
    ADMIN_INCORRECT_LOGIN,
    ADMIN_LOGIN,
    ADMIN_REQUESTS_FAILED_EDIT,
    ADMIN_REQUESTS_FAILED_LOAD,
    ADMIN_REQUESTS_SUCCESSFUL_LOAD,
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
    book: [],
    bookPagesCount: 0,
};

export const adminReducer = (state = initialState, action) => {
    console.log('state', state)
    console.log('type', action.type)
    switch(action.type){
        case ADMIN_LOGIN:{
            return initialState;
        }
        case ADMIN_CORRECT_LOGIN:{
            return {...state, login: '', password: '', sessionId: action.payload.sessionId};
        }
        case ADMIN_BOOK_SUCCESSFUL_LOAD:{
            return {...state, bookData: action.payload.express, bookPagesCount: action.payload.pageCount};
        }
        case ADMIN_BRANCHES_SUCCESSFUL_LOAD:{
            return {...state, branches: action.payload.express}
        }
        case ADMIN_REQUESTS_SUCCESSFUL_LOAD:{
            return {...state, requests: action.payload.express, requestsPagesCount: action.payload.pageCount,}
        }
        case ADMIN_REQUESTS_FAILED_EDIT:
        case ADMIN_REQUESTS_FAILED_LOAD:
        case ADMIN_BRANCHES_FAILED_EDIT:
        case ADMIN_BRANCHES_FAILED_LOAD:
        case ADMIN_BOOK_FAILED_LOAD:
        case ADMIN_INCORRECT_LOGIN:{
            return {...state, error: action.payload.error};
        }
        default: {
            return state;
        }
    }
};