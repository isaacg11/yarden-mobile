export default function formatExpDate(value) {
    if (value) {
        var number;
        var x = value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,2})/);
        number = x[1];
        if (x[2]) number = x[1] + '/' + x[2];

        return number;
    } else {
        return value;
    }
}