import { GET_RULES } from '../actions/rules/types';

let initialState = [];

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_RULES:
            return action.payload;
        default:
            return state;
    }
}