import { GET_FILTERS } from '../../actions/filters/types';

export function setFilters(filters) {
    return async function (dispatch, getState) {

        let payload = {...getState().filters};

        if(filters.orders) payload.orders = filters.orders;
        if(filters.quotes) payload.quotes = filters.quotes;
        if(filters.reminders) payload.reminders = filters.reminders;

        dispatch({type: GET_FILTERS, payload: payload});
    }
}