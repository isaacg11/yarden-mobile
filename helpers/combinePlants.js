import separatePlantsByType from "./separatePlantsByType";

export default function combinePlants(plants) {

    let combinedVegetables = [];
    let combinedHerbs = [];
    let combinedFruit = [];

    plants.forEach((plant) => {
        const vegetables = plant.vegetables;
        const herbs = plant.herbs;
        const fruit = plant.fruit;

        for (let vegetable in vegetables) {
            const vegetablesSeparatedByType = separatePlantsByType(vegetables[vegetable]);
            vegetablesSeparatedByType.forEach((p) => {
                combinedVegetables.push({
                    id: p[0]._id,
                    qty: p.length
                })
            })
        }

        for (let herb in herbs) {
            const herbsSeparatedByType = separatePlantsByType(herbs[herb]);
            herbsSeparatedByType.forEach((h) => {
                combinedHerbs.push({
                    id: h[0]._id,
                    qty: h.length
                })
            })
        }

        for (let fr in fruit) {
            const fruitSeparatedByType = separatePlantsByType(fruit[fr]);
            fruitSeparatedByType.forEach((f) => {
                combinedFruit.push({
                    id: f[0]._id,
                    qty: f.length
                })
            })
        }
    })

    return {
        vegetables: combinedVegetables,
        herbs: combinedHerbs,
        fruit: combinedFruit
    }
}