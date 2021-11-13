export default function minifyDataToID(data, isArray) {
    if (isArray) {
        let minifiedData = [];
        data.forEach((d) => {
            minifiedData.push(d._id);
        })
        return minifiedData;
    } else {
        let minifiedData = {};
        for (let item in data) {
            minifiedData[item] = [];
            data[item].forEach((d) => {
                minifiedData[item].push(d._id)
            })
        }
        return minifiedData;
    }
}