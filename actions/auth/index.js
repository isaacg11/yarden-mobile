import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import { GET_USER } from '../user/types';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import removeAuthToken from '../../helpers/removeAuthToken';
import { alert } from '../../components/UI/SystemAlert';

export function login(user) {
    return async function(dispatch) {
        try {
            const response = await axios.post(`${API_URL}/users/login`, user);
            AsyncStorage.setItem(`auth-token`, response.data.token);
            AsyncStorage.setItem(`auth-token-exp`, moment(moment().add('180', 'days')).format());
            if(response.data.secondary) {
                AsyncStorage.setItem(`secondary`, 'true');
            }

            dispatch({type: GET_USER, payload: response.data.user});
            return response.data.user;
        }
        catch(error) {
            alert('Invalid email or password');
        }
    }
}

export function logout() {
    return async function(dispatch) {
        removeAuthToken();
        dispatch({type: GET_USER, payload: {}});
    }
}

export async function authenticate() {
    return async function(dispatch) {        
        try {
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/users/authenticate`, {headers: {authorization: authToken}});
            dispatch({ type: GET_USER, payload: response.data });
            return response.data;
        }

        catch(error) {
            console.log(error)
            removeAuthToken();
            dispatch({type: GET_USER, payload: {}});
            alert('Please log in to continue');
        }
    }
}

export function resetPassword(id, user) {
    return async function(dispatch) {
        try {
            const response = await axios.put(`${API_URL}/users/${id}`, user);
            AsyncStorage.setItem(`auth-token`, response.data.token);
            AsyncStorage.setItem(`auth-token-exp`, moment(moment().add('30', 'days')).format());
            dispatch({type: GET_USER, payload: response.data.user});
            return response.data.user;
        }
        catch(error) {
            alert(error, 'Invalid email or password');
        }
    }
}