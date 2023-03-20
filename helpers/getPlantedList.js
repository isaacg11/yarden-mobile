export default function getPlantedList(drafts) {

    let planted = [];

    drafts.forEach((draft) => {
        draft.plot_points.forEach((row) => {
            row.forEach((column) => {
                if(column.plant) {
                    planted.push(column.plant);
                }
            })
        })
    })

    return planted;
}