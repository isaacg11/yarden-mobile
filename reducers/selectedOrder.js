import { SET_SELECTED_ORDER } from '../actions/orders/types';

let initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_SELECTED_ORDER:
            return action.payload;
        default:
            return state;
    }
}