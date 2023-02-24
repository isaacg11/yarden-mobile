export default function minifyDataToID(data) {
    let minifiedData = [];
    data.forEach((d) => {
        minifiedData.push({
            id: d._id || d.id,
            qty: d.qty
        });
    })
    
    return minifiedData;
}