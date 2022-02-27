import minifyDataToID from "./minifyDataToID";

export default function combinePlants(plants) {

    let combinedVegetables = [];
    let combinedFruit = [];
    let combinedHerbs = [];

    plants.forEach((plant) => {
        const vegetables = minifyDataToArray(plant.vegetables);
        const fruit = minifyDataToArray(plant.fruit);
        const herbs = plant.herbs;

        vegetables.forEach((v) => {
            const vegetableExists = combinedVegetables.find((cv) => cv._id === v._id);
            if(!vegetableExists) combinedVegetables.push(v);
        })

        fruit.forEach((f) => {
            const fruitExists = combinedFruit.find((cf) => cf._id === f._id);
            if(!fruitExists) combinedFruit.push(f);
        })

        herbs.forEach((h) => {
            const herbsExists = combinedHerbs.find((ch) => ch._id === h._id);
            if(!herbsExists) combinedHerbs.push(h);
        })
    })

    const vegetableIds = minifyDataToID(combinedVegetables);
    const fruitIds = minifyDataToID(combinedFruit);
    const herbIds = minifyDataToID(combinedHerbs);

    return {
        vegetables: vegetableIds,
        herbs: herbIds,
        fruit: fruitIds
    }
}

function minifyDataToArray(data) {
    let plants = [];

    // iterate through plants
    for (let v in data) {

        // iterate through plant classes
        data[v].forEach((d) => {

            // add to plant list
            plants.push(d);
        })
    }

    return plants;
}