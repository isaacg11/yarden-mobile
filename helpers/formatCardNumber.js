export default function formatCardNumber(value, type) {
    if(value) {
        var number;
        if(type === 'american express') {
            var x = value.replace(/\D/g, '').match(/(\d{0,4})(\d{0,6})(\d{0,5})/);
            number = x[1];
            if(x[2]) number = x[1] + '-' + x[2];
            if(x[3]) number = x[1] + '-' + x[2] + '-' + x[3];
        } else {
            var x = value.replace(/\D/g, '').match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
            number = x[1];
            if(x[2]) number = x[1] + '-' + x[2];
            if(x[3]) number = x[1] + '-' + x[2] + '-' + x[3];
            if(x[4]) number = x[1] + '-' + x[2] + '-' + x[3] + '-' + x[4];
        }
        
        return number;
    } else {
        return value;
    }
}