import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { GET_ORDERS } from '../../actions/orders/types';
import { alert } from '../../components/UI/SystemAlert';


export function createOrder(order) {
    return async function () {
        try {
            const authToken = await getAuthToken();
            const response = await axios.post(`${API_URL}/orders`, order, {headers: {authorization: authToken}});
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

export function getOrders(query) {
    return async function(dispatch) {        
        try {
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/orders?${query}`, {headers: {authorization: authToken}});
            dispatch({type: GET_ORDERS, payload: response.data});
            return response.data;
        }

        catch(error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
            }
            
            alert('Something went wrong. We are working on a fix now!');
        }
    }
}

export function updateOrder(id, order) {
    return async function() {
        try {
            const authToken = await getAuthToken();
            const updatedOrder = await axios.put(`${API_URL}/orders/${id}`, order, {headers: {authorization: authToken}});
            return updatedOrder;
        }

        catch(error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
            }
            
            alert('Something went wrong. We are working on a fix now!');
        }
    }
}