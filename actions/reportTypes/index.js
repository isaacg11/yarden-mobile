import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { alert } from '../../components/UI/SystemAlert';

export function getReportType(query) {
    return async function () {
        try {
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/report-types?${query}`, { headers: { authorization: authToken } });
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