import { GET_FILTERS } from '../actions/filters/types';

let initialState = {
    orders: 'pending',
    quotes: 'pending approval',
    reminders: 'pending'
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_FILTERS:
            return action.payload;
        default:
            return state;
    }
}