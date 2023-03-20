export default function convertOuncesToPounds(ounces) {
    const lbs = ounces / 16;
    return parseFloat(lbs.toFixed(1));
}