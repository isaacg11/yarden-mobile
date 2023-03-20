import { GET_PAGINATION } from '../actions/pagination/types';

let initialState = {
    orders: 1,
    reminders: 1,
    quotes: 1
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PAGINATION:
            return action.payload;
        default:
            return state;
    }
}