import separatePlantsByCategory from './separatePlantsByCategory';
import separatePlantsByCommonType from './separatePlantsByCommonType';

export default async function setPlants(selectedPlants) {

    // separate plants by category
    const categorizedPlants = separatePlantsByCategory(selectedPlants);

    // separate categorized plants by common type
    let vegetables = separatePlantsByCommonType(categorizedPlants.vegetables);
    let fruit = separatePlantsByCommonType(categorizedPlants.fruit);
    let herbs = separatePlantsByCommonType(categorizedPlants.herbs);

    // set garden plants
    const plants = {
        vegetables,
        herbs,
        fruit
    }

    return plants;
}