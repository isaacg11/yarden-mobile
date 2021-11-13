export default function formatAddress(data) {
    const address = `${data.address}${((data.unit) ? (' #' + data.unit) : '')}, ${data.city} ${data.state} ${data.zip_code}`;
    return address;
}