import { GET_PAGINATION } from '../../actions/pagination/types';

export function setPagination(pagination) {
    return async function (dispatch, getState) {

        let payload = {...getState().pagination};

        if(pagination.orders) payload.orders = pagination.orders;
        if(pagination.quotes) payload.quotes = pagination.quotes;
        if(pagination.reminders) payload.reminders = pagination.reminders;

        dispatch({type: GET_PAGINATION, payload: payload});
    }
}