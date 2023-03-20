import { SET_ANSWERS } from '../actions/answers/types';

let initialState = [];

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_ANSWERS:
            return action.payload;
        default:
            return state;
    }
}