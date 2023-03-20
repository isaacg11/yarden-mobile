import { GET_DRAFTS } from '../actions/drafts/types';

let initialState = [];

export default function( state = initialState, action) {
    switch(action.type){
      case GET_DRAFTS :
        return action.payload;
      default :
        return state;
    }
}