export default function calculatePercentage(num1, num2) {
    const diff = Math.abs(num1 - num2);
    const avg = (num1 + num2) / 2;
    if (((diff / avg) * 100) > 100) {
        if (num2 >= 1) {
            return ((diff / avg) * 100) - 100;
        } else {
            return (num2 / num1).toFixed(2) * 100;
        }
    } else {
        return 100 - ((diff / avg) * 100);
    }
}