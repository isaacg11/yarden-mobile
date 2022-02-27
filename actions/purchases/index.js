import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { GET_PURCHASES } from '../../actions/purchases/types';
import { alert } from '../../components/UI/SystemAlert';

export function createPurchase(purchase) {
    return async function () {
        try {
            const authToken = await getAuthToken();
            const response = await axios.post(`${API_URL}/purchases`, purchase, {headers: {authorization: authToken}});
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

export function getPurchases(query, override) {
    return async function(dispatch) {        
        try {
            const q = (query) ? `?${query}` : '';
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/purchases${q}`, {headers: {authorization: authToken}});    
            if(!override) dispatch({type: GET_PURCHASES, payload: response.data});
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

