import { GET_NOTES } from '../actions/notes/types';

let initialState = [];

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_NOTES:
            return action.payload;
        default:
            return state;
    }
}