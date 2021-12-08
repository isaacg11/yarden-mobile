import { GET_CONVERSATIONS } from '../actions/conversations/types';

let initialState = [];

export default function( state = initialState, action){
    switch(action.type){
      case GET_CONVERSATIONS :
        return action.payload;
      default :
        return state;
    }
}