export default function separatePlantsByCategory(plants) {
    
    // set initial values
    let vegetables = [];
    let herbs = [];
    let fruit = [];

    // separate plants by category
    plants.forEach((plant) => {
        if (plant.category.name === 'vegetable') vegetables.push(plant);
        if (plant.category.name === 'culinary herb') herbs.push(plant);
        if (plant.category.name === 'fruit') fruit.push(plant);
    })

    // set category data
    const categoryData = {
        vegetables,
        herbs,
        fruit
    }

    // return value
    return categoryData;
}