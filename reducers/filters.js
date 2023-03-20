import { GET_FILTERS } from '../actions/filters/types';

let initialState = {
    orders: 'pending',
    reminders: 'pending',
    quotes: 'pending approval',
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_FILTERS:
            return action.payload;
        default:
            return state;
    }
}