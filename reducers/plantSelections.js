import { GET_PLANT_SELECTIONS } from '../actions/plantSelections/types';

let initialState = {
    vegetables: [],
    herbs: [],
    fruit: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PLANT_SELECTIONS:
            return action.payload;
        default:
            return state;
    }
}