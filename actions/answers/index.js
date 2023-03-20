import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { SET_ANSWERS } from '../../actions/answers/types';
import { alert } from '../../components/UI/SystemAlert';

export function createAnswer(answer) {
    return async function () {
        try {
            const authToken = await getAuthToken();
            const response = await axios.post(`${API_URL}/answers`, answer, { headers: { authorization: authToken } });
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

export function getAnswers(query) {
    return async function () {
        try {
            const q = (query) ? `?${query}` : '';
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/answers${q}`, { headers: { authorization: authToken } });
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

export function setAnswers(answers) {
    return async function (dispatch) {
        return dispatch({ type: SET_ANSWERS, payload: answers });
    }
}