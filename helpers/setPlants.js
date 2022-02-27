import separatePlantsByCategory from './separatePlantsByCategory';
import separatePlantsByClass from './separatePlantsByClass';

export default function setPlants(selectedPlants) {

    // separate plants by category
    const categorizedPlants = separatePlantsByCategory(selectedPlants);

    // separate categorized plants by class
    let vegetables = separatePlantsByClass(categorizedPlants.vegetables);
    let fruit = separatePlantsByClass(categorizedPlants.fruit);
    let herbs = categorizedPlants.herbs;

    // set garden plants
    const plants = {
        vegetables,
        herbs,
        fruit
    }

    return plants;
}