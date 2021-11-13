import { GET_PLANTS } from '../actions/plants/types';

let initialState = [];

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PLANTS:
            return action.payload;
        default:
            return state;
    }
}