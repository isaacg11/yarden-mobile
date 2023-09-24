export default function combineBeds(beds) {
    const groupedData = {};

    beds.forEach((bed) => {
        const key = `${bed.width}-${bed.length}-${bed.height}`;

        if (groupedData[key]) {
            groupedData[key].qty += 1;
        } else {
            groupedData[key] = {
                qty: 1,
                width: bed.width,
                length: bed.length,
                height: bed.height,
                shape: bed.shape
            };
        }
    });

    const result = Object.values(groupedData);
    return result;
}