import { combineReducers } from 'redux';
import user from './user';
import users from './users';
import error from './error';

const rootReducer = combineReducers({
    user,
    users,
    error
})

export default rootReducer;