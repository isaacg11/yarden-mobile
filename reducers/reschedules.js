import { GET_RESCHEDULES } from '../actions/reschedules/types';

let initialState = [];

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_RESCHEDULES:
            return action.payload;
        default:
            return state;
    }
}