import axios from 'axios';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import { GET_PRODUCT_CATEGORIES } from '../../actions/productCategories/types';
import { alert } from '../../components/UI/SystemAlert';

export function getProductCategories(query) {
    return async function(dispatch) {        
        try {
            const q = (query) ? `?${query}` : '';
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/product-categories${q}`, {headers: {authorization: authToken}});    
            dispatch({type: GET_PRODUCT_CATEGORIES, payload: response.data});
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
