// libs
import axios from 'axios';

// helpers
import {API_URL} from '../../helpers/getUrl';
import getAuthToken from '../../helpers/getAuthToken';

// UI components
import {alert} from '../../components/UI/SystemAlert';

export function getPlantSelection(customerId) {
  return async function () {
    try {
      const authToken = await getAuthToken();
      const response = await axios.get(
        `${API_URL}/plant-selections/${customerId}`,
        {headers: {authorization: authToken}},
      );
      return response.data;
    } catch (error) {
      alert('Something went wrong. We are working on a fix now!');
    }
  };
}
