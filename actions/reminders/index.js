import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { GET_REMINDERS } from './types';
import { alert } from '../../components/UI/SystemAlert';

export function createReminder(reminder) {
    return async function () {
        try {
            const authToken = await getAuthToken();
            const response = await axios.post(`${API_URL}/tasks`, reminder, { headers: { authorization: authToken } });
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


export function getReminders(query, override) {
    return async function (dispatch) {
        try {
            const q = (query) ? `?${query}` : '';
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/tasks${q}`, { headers: { authorization: authToken } });
            if (!override) dispatch({ type: GET_REMINDERS, payload: response.data });
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

export function updateReminder(id, task) {
    return async function(dispatch) {
        try {
            const authToken = await getAuthToken();
            const response = await axios.put(`${API_URL}/tasks/${id}`, task, {headers: {authorization: authToken}});
            return response;
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