export default function combinePlants(plants) {

    let combinedVegetables = [];
    let combinedHerbs = [];
    let combinedFruit = [];

    plants.forEach((plant) => {
        const vegetables = plant.vegetables;
        const herbs = plant.herbs;
        const fruit = plant.fruit;
        
        for(let vegetable in vegetables) {
            combinedVegetables.push({
                id: vegetables[vegetable][0]._id,
                qty: vegetables[vegetable].length,
            })
        }

        for(let herb in herbs) {
            combinedHerbs.push({
                id: herbs[herb][0]._id,
                qty: herbs[herb].length,
            })
        }

        for(let fr in fruit) {
            combinedFruit.push({
                id: fruit[fr][0]._id,
                qty: fruit[fr].length,
            })
        }
    })

    return {
        vegetables: combinedVegetables,
        herbs: combinedHerbs,
        fruit: combinedFruit
    }
}