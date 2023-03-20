import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { GET_BEDS } from '../../actions/beds/types';
import { alert } from '../../components/UI/SystemAlert';

export function createBed(bed) {
    return async function () {
        try {
            const authToken = await getAuthToken();
            const response = await axios.post(`${API_URL}/beds`, bed, { headers: { authorization: authToken } });

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

export function getBeds(query, override) {
    return async function (dispatch) {
        try {
            const q = (query) ? `?${query}` : '';
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/beds${q}`, { headers: { authorization: authToken } });
            if (!override) dispatch({ type: GET_BEDS, payload: response.data });
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

export function updateBed(id, bed) {
    return async function () {
        try {
            const authToken = await getAuthToken();
            const updatedBed = await axios.put(`${API_URL}/beds/${id}`, bed, { headers: { authorization: authToken } });
            return updatedBed;
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
