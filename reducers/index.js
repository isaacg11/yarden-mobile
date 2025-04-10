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
import referrals from './referrals';
import reminders from './reminders';
import drafts from './drafts';
import beds from './beds';
import selectedOrder from './selectedOrder';
import notes from './notes';
import questions from './questions';
import answers from './answers';
import plantActivities from './plantActivities';
import reports from './reports';
import pagination from './pagination';
import plantList from './plantList';
import reschedules from './reschedules';

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
    filters,
    referrals,
    reminders,
    drafts,
    beds,
    selectedOrder,
    notes,
    questions,
    answers,
    plantActivities,
    reports,
    pagination,
    plantList,
    reschedules
})

export default rootReducer;