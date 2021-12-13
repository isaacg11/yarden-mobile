import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import { alert } from '../../components/UI/SystemAlert';

export function sendSms(sms) {
    return async function () {
        try {
            const response = await axios.post(`${API_URL}/sms`, sms);
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