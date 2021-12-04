import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GET_USER } from './types';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { alert } from '../../components/UI/SystemAlert';


export function createUser(user) {
    return async function (dispatch) {
        try {
            const response = await axios.post(`${API_URL}/users/signup`, user);
            AsyncStorage.setItem(`auth-token`, response.data.token);
            AsyncStorage.setItem(`auth-token-exp`, moment(moment().add('30', 'days')).format());
            dispatch({ type: GET_USER, payload: response.data.user });
            return response.data.user;
        }

        catch (error) {
            console.log(error);
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                if(error.response.status === 403) {
                    return alert(`Account already exists with email ${user.user.email}`);
                }
            }

            alert('Something went wrong. We are working on a fix now!');
        }
    }
}

export function updateUser(query, user) {
    return async function(dispatch) {
        const q = (query) ? `?${query}` : '';
        try {
            const authToken = await getAuthToken();
            const response = await axios.put(`${API_URL}/users${q}`, user, {headers: {authorization: authToken}});
            dispatch({ type: GET_USER, payload: response.data });
            return response.data;
        }

        catch(error) {
            console.log(error);
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
            }
            alert('Something went wrong. We are working on a fix now!');
        }
    }
}