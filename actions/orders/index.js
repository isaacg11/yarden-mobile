import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { GET_ORDERS, SET_SELECTED_ORDER } from '../../actions/orders/types';
import { alert } from '../../components/UI/SystemAlert';

export function createOrder(order) {
    return async function () {
        try {
            const authToken = await getAuthToken();
            const response = await axios.post(`${API_URL}/orders`, order, { headers: { authorization: authToken } });
            return response.data;
        }

        catch (error) {
            console.log(error);
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
            }

            alert('Something went wrong. We are working on a fix now!');
        }
    }
}

export function getOrders(query, override) {
    return async function (dispatch) {
        try {
            const q = (query) ? `?${query}` : '';
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/orders${q}`, { headers: { authorization: authToken } });
            if (!override) dispatch({ type: GET_ORDERS, payload: response.data });
            return response.data;
        }

        catch (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
            }

            alert('Something went wrong. We are working on a fix now!');
        }
    }
}

export function getOrder(id) {
    return async function () {
        try {
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/orders/${id}`, { headers: { authorization: authToken } });
            return response.data;
        }

        catch (error) {
            alert('Something went wrong. We are working on a fix now!');
        }
    }
}

export function updateOrder(id, order) {
    return async function () {
        try {
            const authToken = await getAuthToken();
            const updatedOrder = await axios.put(`${API_URL}/orders/${id}`, order, { headers: { authorization: authToken } });
            return updatedOrder;
        }

        catch (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
            }

            alert('Something went wrong. We are working on a fix now!');
        }
    }
}

export function updateOrders(query, order) {
    return async function () {
        try {
            const authToken = await getAuthToken();
            const q = (query) ? `?${query}` : '';
            const updatedOrders = await axios.put(`${API_URL}/orders${q}`, order, { headers: { authorization: authToken } });
            return updatedOrders;
        }

        catch (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
            }

            alert('Something went wrong. We are working on a fix now!');
        }
    }
}

export function setSelectedOrder(order) {
    return async function (dispatch) {
        return dispatch({ type: SET_SELECTED_ORDER, payload: order });
    }
}