export default async function formatMaterials(materials) {
    let formattedMaterials = [];

    // iterate through combined materials
    materials.forEach((m) => {

        // add to formatted materials
        formattedMaterials.push({
            name: m.name,
            url: m.url,
            price: m.price,
            qty: m.qty
        })
    })

    return formattedMaterials;
}