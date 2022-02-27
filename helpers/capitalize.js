export default function capitalize(data) {
    const capitalized = data.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    return capitalized;
}