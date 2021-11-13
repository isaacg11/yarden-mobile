import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { alert } from '../../components/UI/SystemAlert';

export function createApproval(approval) {
    return async function() {        
        try {
            const authToken = await getAuthToken();
            const response = await axios.post(`${API_URL}/approvals`, approval, {headers: {authorization: authToken}});
            return response;
        }

        catch(error) {
            alert(error, 'Something went wrong. We are working on a fix now!');
        }
    }
}