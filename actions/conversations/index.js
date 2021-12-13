import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { GET_CONVERSATIONS } from '../../actions/conversations/types';
import { alert } from '../../components/UI/SystemAlert';


export function createConversation(conversation) {
    return async function () {
        try {
            const authToken = await getAuthToken();
            const response = await axios.post(`${API_URL}/conversations`, conversation, {headers: {authorization: authToken}});
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

export function getConversations(query, override) {
    return async function(dispatch) {        
        try {
            const q = (query) ? `?${query}` : '';
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/conversations${q}`, {headers: {authorization: authToken}});            
            if(!override) dispatch({type: GET_CONVERSATIONS, payload: response.data});
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