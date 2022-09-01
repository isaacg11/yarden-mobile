import { GET_REMINDERS } from '../actions/reminders/types';

let initialState = {};

export default function( state = initialState, action){
    switch(action.type){
      case GET_REMINDERS  :
        return action.payload;
      default :
        return state;
    }
}