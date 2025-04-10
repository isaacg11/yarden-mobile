import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import { alert } from '../../components/UI/SystemAlert';
import config from '../../config/index';

export function getGeolocation(query) {
    return async function () {
        try {
            const response = await axios.get(`${API_URL}/locations/geolocation?${query}`);
            return response;
        }

        catch (error) {
            alert('Something went wrong. We are working on a fix now!');
        }
    }
}

export function getCounty(query) {
    return async function() {
        try {
            const response = await axios.get(`${API_URL}/locations/county?${query}`);
            return response;
        }

        catch(error) {
            alert('Something went wrong. We are working on a fix now!');
        }
    }
}

export function getServiceArea(query) {
    return async function() {
        try {
            const response = await axios.get(`${API_URL}/counties?${query}`);
            return response;
        }

        catch(error) {
            alert('Something went wrong. We are working on a fix now!');
        }
    }
}

export function getIP() {
    return async function() {
        try {
            const response = await axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=${config.abstractApiKey}`);
            return response;
        }

        catch(error) {
            alert('Something went wrong. We are working on a fix now!');
        }
    }
}
