import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import { alert } from '../../components/UI/SystemAlert';

export function sendAlert(info) {
    return async function () {
        try {
            if(!__DEV__) await axios.post(`${API_URL}/alerts`, info);
        } catch (error) {
            alert('Something went wrong. We are working on a fix now!');
        }
    }
}