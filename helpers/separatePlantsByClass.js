export default function separatePlantsByClass(plants) {

    // set initial values
    let fruiting = [];
    let gourd = [];
    let shooting = [];
    let leafy = [];
    let pod = [];
    let bulb = [];
    let root = [];
    let bud = [];
    let berry = [];
    let pit = [];
    let core = [];
    let citrus = [];
    let melon = [];
    let tropical = [];
    let classData = {};

    // separate plants by class
    plants.forEach((plant, index) => {
        if (plant.category.name === 'vegetable') {
            if (plant.class) {
                if (plant.class.name === 'fruiting') fruiting.push(plant);
                if (plant.class.name === 'gourd') gourd.push(plant);
                if (plant.class.name === 'shooting') shooting.push(plant);
                if (plant.class.name === 'leafy') leafy.push(plant);
                if (plant.class.name === 'pod') pod.push(plant);
                if (plant.class.name === 'bulb') bulb.push(plant);
                if (plant.class.name === 'root') root.push(plant);
                if (plant.class.name === 'bud') bud.push(plant);
                if (index === (plants.length - 1)) {
                    classData = {
                        fruiting,
                        gourd,
                        shooting,
                        leafy,
                        pod,
                        bulb,
                        root,
                        bud
                    }
                }
            }
        }

        if (plant.category.name === 'fruit') {
            if (plant.class) {
                if (plant.class.name === 'berry') berry.push(plant);
                if (plant.class.name === 'pit') pit.push(plant);
                if (plant.class.name === 'core') core.push(plant);
                if (plant.class.name === 'citrus') citrus.push(plant);
                if (plant.class.name === 'melon') melon.push(plant);
                if (plant.class.name === 'tropical') tropical.push(plant);
                if (index === (plants.length - 1)) {
                    classData = {
                        berry,
                        pit,
                        core,
                        citrus,
                        melon,
                        tropical
                    }
                }
            }
        }
    })

    return classData;
}