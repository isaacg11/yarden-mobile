import { combineReducers } from 'redux';
import user from './user';
import users from './users';
import error from './error';
import orders from './orders';
import quotes from './quotes';
import plants from './plants';
import plans from './plans';
import changeOrders from './changeOrders';
import conversations from './conversations';

const rootReducer = combineReducers({
    user,
    users,
    error,
    orders,
    quotes,
    plants,
    plans,
    changeOrders,
    conversations
})

export default rootReducer;