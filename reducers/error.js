import { ERROR } from '../actions/error/types';

let initialState = {
    message: null
}

export default function( state = initialState, action){
    switch(action.type){
        case ERROR:
            return {
                message: action.payload
            }
        default:
            return state;
    }
}