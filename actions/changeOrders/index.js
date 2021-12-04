import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { GET_CHANGE_ORDERS } from '../../actions/changeOrders/types';
import { alert } from '../../components/UI/SystemAlert';

export function getChangeOrders(query, override) {
    return async function(dispatch, getState) {        
        try {
            const q = (query) ? `?${query}` : '';
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/change-orders${q}`, {headers: {authorization: authToken}});

            if(override) {
                return response.data;
            } else {
                const currentProps = await getState();

                let changeOrders = [];
                
                await response.data.forEach((c) => changeOrders.push(c));
    
                if(currentProps.changeOrders.length > 0) {
                    await currentProps.changeOrders.forEach((c) => {
                        const exists = changeOrders.find((changeOrder) => changeOrder._id === c._id);
                        if(!exists) changeOrders.push(c)
                    });
                }
    
                dispatch({type: GET_CHANGE_ORDERS, payload: changeOrders});
            }
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

export function updateChangeOrder(id, changeOrder) {
    return async function() {
        try {
            const authToken = await getAuthToken();
            const updatedOrder = await axios.put(`${API_URL}/change-orders/${id}`, changeOrder, {headers: {authorization: authToken}});
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

export function resetChangeOrders() {
    return async function(dispatch) {        
        dispatch({type: GET_CHANGE_ORDERS, payload: []});
    }
}