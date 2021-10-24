import { GET_USER } from '../actions/user/types';

let initialState = {}

export default function( state = initialState, action){
    switch(action.type){
      case GET_USER :
        return {...action.payload}
      default :
        return state;
    }
}