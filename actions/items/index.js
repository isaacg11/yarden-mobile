import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';
import getCartVariants from '../../helpers/getCartVariants';
import { GET_ITEMS } from '../../actions/items/types';
import { alert } from '../../components/UI/SystemAlert';

export function getItems(query) {
    return async function (dispatch) {
        try {
            const q = (query) ? `?${query}` : '';
            const authToken = await getAuthToken();
            const response = await axios.get(`${API_URL}/products${q}`, { headers: { authorization: authToken } });

            // set initial items value
            let items = [];

            let products = response.data.filter((product) => product.variants.length > 0);

            products.forEach(async (product, index) => {

                // check for item in storage
                const item = await AsyncStorage.getItem(`${product._id}`);

                // if item exists
                if (item) items.push({ product: product, qty: parseInt(item) });

                // if last iteration of loop, update UI
                if (index === products.length - 1) {

                    // get variants of item
                    const itemsWithVariants = await getCartVariants(items);

                    // update UI
                    return dispatch({ type: GET_ITEMS, payload: itemsWithVariants });
                }
            })
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