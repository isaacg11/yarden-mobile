import { GET_PLANT_LIST } from '../actions/plantList/types';

let initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PLANT_LIST:
            return action.payload;
        default:
            return state;
    }
}