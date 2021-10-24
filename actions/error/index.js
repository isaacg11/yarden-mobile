import { ERROR } from '../error/types';

export function throwError(error, message) {
    return async function(dispatch) {
        console.log(error)
        dispatch({type: ERROR, payload: message});
    }
}