import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { alert } from '../../components/UI/SystemAlert';

export function getImage(fileName, fileType) {
    return async function() {        
        try {
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/images?name=${fileName}&type=${fileType}`, {headers: {authorization: authToken}});
            return response;
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

export function updateImage(signedRequest, file, options) {
    return async function() {        
        try {
            const response = await axios.put(signedRequest, file, options);
            return response;
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