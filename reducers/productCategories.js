import { GET_PRODUCT_CATEGORIES } from '../actions/productCategories/types';

let initialState = [];

export default function( state = initialState, action){
    switch(action.type){
      case GET_PRODUCT_CATEGORIES  :
        return action.payload;
      default :
        return state;
    }
}