import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { alert } from '../../components/UI/SystemAlert';

export function createSubscription(subscription) {
    return async function() {        
        try {
            const authToken = await getAuthToken();
            const response = await axios.post(`${API_URL}/subscriptions`, subscription, {headers: {authorization: authToken}});            
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

export function getSubscription(planId) {
    return async function() {        
        try {
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/subscriptions/${planId}`, {headers: {authorization: authToken}});            
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

export function deleteSubscription(id) {
    return async function() {        
        try {
            const authToken = await getAuthToken();
            const response = await axios.delete(`${API_URL}/subscriptions/${id}`, {headers: {authorization: authToken}});            
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