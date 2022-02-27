import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { GET_QUOTES } from '../../actions/quotes/types';
import { alert } from '../../components/UI/SystemAlert';

export function createQuote(quote) {
    return async function() {
        try {
            const authToken = await getAuthToken();
            const response = await axios.post(`${API_URL}/bids`, quote, {headers: {authorization: authToken}});
            return response.data;
        }

        catch(error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
            }

            alert(error, 'Something went wrong. We are working on a fix now!');
        }
    }
}

export function getQuotes(query) {
    return async function(dispatch) {        
        try {
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/bids?${query}`, {headers: {authorization: authToken}});  
            dispatch({type: GET_QUOTES, payload: response.data});
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

export function updateQuote(id, quote) {
    return async function() {
        try {
            const authToken = await getAuthToken();
            const response = await axios.put(`${API_URL}/bids/${id}`, quote, {headers: {authorization: authToken}});
            return response;
        }

        catch(error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
            }

            alert(error, 'Something went wrong. We are working on a fix now!');
        }
    }
}