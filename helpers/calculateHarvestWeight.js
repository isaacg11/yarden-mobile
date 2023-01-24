import convertOuncesToPounds from "./convertOuncesToPounds";

export default function calculateHarvestWeight(plantActivity) {
    const weight = (plantActivity.head === true) ? plantActivity.plant.average_head_weight : plantActivity.plant.average_produce_weight;
    const qty = plantActivity.qty;
    const totalOunces = weight * qty;
    const totalPounds = convertOuncesToPounds(totalOunces);
    return totalPounds;
}