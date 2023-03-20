export default function calculatePlantingProgress(data) {
    if(data) {
        let plotPoints = 0;
        let complete = 0;
        data.plot_points.forEach((row) => {
            row.forEach((column) => {
                plotPoints += 1;
                if(column.plant) {
                    complete += 1;
                }
            })
        })
    
        const result = (complete / plotPoints) * 100;
    
        return `${result.toFixed(2)}%`
    } else {
        return '0%';
    }
}