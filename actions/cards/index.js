import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { alert } from '../../components/UI/SystemAlert';

export function createToken(card) {
    return async function() {        
        try {
            const authToken = await getAuthToken();
            const response = await axios.post(`${API_URL}/cards/token`, card, {headers: {authorization: authToken}});            
            return response.data;
        }

        catch(error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
            }
            
            alert('Invalid card');
        }
    }
}

export function createCustomer(customer) {
    return async function() {        
        try {
            const authToken = await getAuthToken();
            const response = await axios.post(`${API_URL}/cards/customer`, customer, {headers: {authorization: authToken}});            
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

export function deleteCard() {
    return async function() {
        try {
            const authToken = await getAuthToken();
            const response = await axios.delete(`${API_URL}/cards/source`, {headers: {authorization: authToken}});
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

export function createCard(card) {
    return async function() {
        try {
            const authToken = await getAuthToken();
            const response = await axios.post(`${API_URL}/cards/source`, card, {headers: {authorization: authToken}});
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

export function chargeCard(payment) {
    return async function() {
        try {
            const authToken = await getAuthToken();
            const response = await axios.post(`${API_URL}/payments`, payment, {headers: {authorization: authToken}});

            
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
