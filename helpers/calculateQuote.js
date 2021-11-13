import calculateMaterialsCost from "./calculateMaterials";

export default function calculateQuoteCost(quote) {
    const materialsTotal = (quote.materials) ? calculateMaterialsCost(quote.materials) : 0;
    const laborTotal = (quote.labor) ? (quote.labor.qty * quote.labor.price) : 0;
    const deliveryTotal = (quote.delivery) ? quote.delivery.price : 0;
    const rentalTotal = (quote.rentals) ? quote.rentals.price : 0;
    const disposalTotal = (quote.disposal) ? quote.disposal.price : 0;

    return {
        materialsTotal: materialsTotal,
        laborTotal: laborTotal,
        deliveryTotal: deliveryTotal,
        rentalTotal: rentalTotal,
        disposalTotal: disposalTotal
    }
}