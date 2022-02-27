import { GET_ITEMS } from '../actions/items/types';

let initialState = [];

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ITEMS:
            return action.payload;
        default:
            return state;
    }
}