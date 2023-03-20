import { GET_BEDS } from '../actions/beds/types';

let initialState = [];

export default function( state = initialState, action) {
    switch(action.type){
      case GET_BEDS :
        return action.payload;
      default :
        return state;
    }
}