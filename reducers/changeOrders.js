import { GET_CHANGE_ORDERS } from '../actions/changeOrders/types';

let initialState = [];

export default function( state = initialState, action){
    switch(action.type){
      case GET_CHANGE_ORDERS :
        return action.payload;
      default :
        return state;
    }
}