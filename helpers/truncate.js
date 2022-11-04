export default function truncate(str, length) {
    if (length == null) {
        length = 100;
    }

    if (str.length > length) {
        return str.substring(0, length) + '...';
    } else {
        return str;
    }
}