export default function separatePlantsByType(plants) {
    let result = {};
    plants.forEach((object) => {
        let id = object._id;
        if (!result[id]) {
            result[id] = [];
        }
        result[id].push(object);
    });

    return Object.values(result);
}