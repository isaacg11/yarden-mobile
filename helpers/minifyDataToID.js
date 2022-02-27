export default function minifyDataToID(data) {
    let minifiedData = [];
    data.forEach((d) => {
        minifiedData.push(d._id);
    })
    return minifiedData;
}