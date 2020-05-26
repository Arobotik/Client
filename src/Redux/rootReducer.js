import {combineReducers} from "redux";
import { routerReducer } from 'react-router-redux';
import {userReducer} from "./userReducer";
import {adminReducer} from "./adminReducer";

export const rootReducer = combineReducers({
    routing: routerReducer,
    user: userReducer,
    admin: adminReducer
});