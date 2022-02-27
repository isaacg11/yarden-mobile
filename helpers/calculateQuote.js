import calculateMaterialsCost from "./calculateMaterials";

export default function calculateQuoteCost(lineItems) {
    const materialsTotal = (lineItems.materials) ? calculateMaterialsCost(lineItems.materials) : 0;
    const laborTotal = (lineItems.labor) ? (lineItems.labor.qty * lineItems.labor.price) : 0;
    const deliveryTotal = (lineItems.delivery) ? lineItems.delivery.price : 0;
    const rentalTotal = (lineItems.rentals) ? lineItems.rentals.price : 0;
    const disposalTotal = (lineItems.disposal) ? lineItems.disposal.price : 0;

    return {
        materialsTotal: materialsTotal,
        laborTotal: laborTotal,
        deliveryTotal: deliveryTotal,
        rentalTotal: rentalTotal,
        disposalTotal: disposalTotal
    }
}