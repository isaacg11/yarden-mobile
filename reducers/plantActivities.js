import { GET_PLANT_ACTIVITIES } from '../actions/plantActivities/types';

let initialState = [];

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PLANT_ACTIVITIES:
            return action.payload;
        default:
            return state;
    }
}