import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { GET_PLANT_LIST } from '../../actions/plantList/types';
import { alert } from '../../components/UI/SystemAlert';

export function getPlantList(query, override) {
    return async function (dispatch) {
        try {
            const q = (query) ? `?${query}` : '';
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/plant-lists${q}`, { headers: { authorization: authToken } });
            if (!override) dispatch({ type: GET_PLANT_LIST, payload: response.data });
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

export function updatePlantList(id, plantList) {
    return async function () {
        try {
            const authToken = await getAuthToken();
            const response = await axios.put(`${API_URL}/plant-lists/${id}`, plantList, { headers: { authorization: authToken } });
            return response;
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