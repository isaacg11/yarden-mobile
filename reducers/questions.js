import { GET_QUESTIONS } from '../actions/questions/types';

let initialState = [];

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_QUESTIONS:
            return action.payload;
        default:
            return state;
    }
}