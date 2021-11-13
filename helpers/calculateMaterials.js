export default function calculateMaterialsCost(materials) {
    let materialsTotal = 0;
    materials.forEach((item) => {
        materialsTotal += (item.price * item.qty);
    })

    return materialsTotal;
}