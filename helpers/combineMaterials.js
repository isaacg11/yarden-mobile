export default async function combineMaterials(allMaterials) {
    let materials = [];

    allMaterials.forEach((productGroup) => {

        productGroup.forEach((item) => {
            
            let exists = materials.find((material) => material.name === item.name);
            if (exists) {
                exists.qty += item.qty;
            } else {
                materials.push(item);
            }
        })
    })

    return materials;
}