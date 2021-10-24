import axios from 'axios';
import { GET_USERS } from './types';
import { API_URL } from '../../helpers/getUrl';
import { alert } from '../../components/UI/SystemAlert';

export function getUsers(query) {
    return async function(dispatch) {

        const q = (query) ? `?${query}` : '';

        try {
            const response = await axios.get(`${API_URL}/users${q}`);
            dispatch({ type: GET_USERS, payload: response.data });
            return response.data;
        }

        catch(error) {
            alert('Something went wrong. We are working on a fix now!');
        }
    }
}