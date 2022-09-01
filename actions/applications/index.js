import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { alert } from '../../components/UI/SystemAlert';

export function createApplication(application) {
    return async function () {
        try {
            const authToken = await getAuthToken();
            const response = await axios.post(`${API_URL}/applications`, application, { headers: { authorization: authToken } });
            return response;
        }

        catch (error) {
            alert(error, 'Something went wrong. We are working on a fix now!');
        }
    }
}

export async function getApplication(id) {
    try {
        const response = await axios.get(`${API_URL}/applications/${id}`);
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