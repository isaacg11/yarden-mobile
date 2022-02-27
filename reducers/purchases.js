import { GET_PURCHASES } from '../actions/purchases/types';

let initialState = {};

export default function( state = initialState, action){
    switch(action.type){
      case GET_PURCHASES :
        return action.payload;
      default :
        return state;
    }
}