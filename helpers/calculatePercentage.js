export default function calculatePercentage(total, value) {
    const percentage = (value / total) * 100;
    return percentage.toFixed(2);
}