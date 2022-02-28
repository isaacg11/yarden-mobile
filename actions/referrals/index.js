import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { GET_REFERRALS } from '../../actions/referrals/types';
import { alert } from '../../components/UI/SystemAlert';

export function getReferrals(query) {
    return async function(dispatch) {        
        try {
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/referrals?${query}`, {headers: {authorization: authToken}});  
            dispatch({type: GET_REFERRALS, payload: response.data});
            return response.data;
        }

        catch(error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
            }
            
            alert('Something went wrong. We are working on a fix now!');
        }
    }
}