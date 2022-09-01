export default function separatePlantsByCommonType(plants) {

    // set initial seperated plants
    let separatedPlants = {};

    // iterate through plants
    for (let i = 0; i < plants.length; i++) {

        // get plant name
        let name = plants[i].id.common_type.name;

        // if key for plant does not exist on separatedPlants object yet {...}
        if (!separatedPlants[plants[i].id.common_type.name]) {

            // set new key and value on separatedPlants
            separatedPlants[`${name}`] = [plants[i]];
        } else {

            // add new element to array for common type
            separatedPlants[`${name}`].push(plants[i])
        }
    }

    return separatedPlants;
}