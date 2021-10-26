import { combineReducers } from 'redux';
import user from './user';
import users from './users';
import error from './error';
import orders from './orders';

const rootReducer = combineReducers({
    user,
    users,
    error,
    orders
})

export default rootReducer;