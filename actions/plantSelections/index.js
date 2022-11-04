import { GET_PLANT_SELECTIONS } from '../../actions/plantSelections/types';

export async function getPlantSelections(selections) {
    return async function(dispatch) {        
        dispatch({type: GET_PLANT_SELECTIONS, payload: selections});
    }
}