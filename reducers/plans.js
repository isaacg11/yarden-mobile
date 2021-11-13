import { GET_PLANS } from '../actions/plans/types';

let initialState = [];

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PLANS:
            return action.payload;
        default:
            return state;
    }
}