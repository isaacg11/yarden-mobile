import { GET_REFERRALS } from '../actions/referrals/types';

let initialState = [];

export default function( state = initialState, action){
    switch(action.type){
      case GET_REFERRALS :
        return action.payload;
      default :
        return state;
    }
}