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
import productCategories from './productCategories';
import products from './products';
import items from './items';
import rules from './rules';
import purchases from './purchases';
import irrigation from './irrigation';
import filters from './filters';

const rootReducer = combineReducers({
    user,
    users,
    error,
    orders,
    quotes,
    plants,
    plans,
    changeOrders,
    conversations,
    productCategories,
    products,
    items,
    rules,
    purchases,
    irrigation,
    filters
})

export default rootReducer;