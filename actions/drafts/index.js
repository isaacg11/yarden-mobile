import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { GET_DRAFTS } from '../../actions/drafts/types';
import { alert } from '../../components/UI/SystemAlert';

export function createDraft(draft) {
    return async function () {
        try {
            const authToken = await getAuthToken();
            const response = await axios.post(`${API_URL}/drafts`, draft, {headers: {authorization: authToken}});

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

export function getDrafts(query, override) {
    return async function(dispatch) {        
        try {
            const q = (query) ? `?${query}` : '';
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/drafts${q}`, {headers: {authorization: authToken}});
            if(!override) dispatch({type: GET_DRAFTS, payload: response.data});
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

export function updateDraft(id, draft) {
    return async function() {
        try {
            const authToken = await getAuthToken();
            const updatedOrder = await axios.put(`${API_URL}/drafts/${id}`, draft, {headers: {authorization: authToken}});
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
