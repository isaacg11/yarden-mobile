import { GET_QUOTES } from '../actions/quotes/types';

let initialState = {};

export default function( state = initialState, action){
    switch(action.type){
      case GET_QUOTES  :
        return action.payload;
      default :
        return state;
    }
}