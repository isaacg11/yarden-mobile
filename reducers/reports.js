import { GET_REPORTS } from '../actions/reports/types';

let initialState = [];

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_REPORTS:
            return action.payload;
        default:
            return state;
    }
}