import { GET_IRRIGATION } from '../actions/irrigation/types';

let initialState = [];

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_IRRIGATION:
            return action.payload;
        default:
            return state;
    }
}