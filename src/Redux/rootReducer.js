import {combineReducers} from "redux";
import {userReducer} from "./userReducer";
import { routerReducer } from 'react-router-redux';

export const rootReducer = combineReducers({
    routing: routerReducer,
    user: userReducer,
});