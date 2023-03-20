export default function calculatePlotPoints(bed) {
    switch (bed.shape.name) {
        case 'rectangle':
            const rows = (bed.length / 12);
            const columns = (bed.width / 12);
            const plotPoints = (rows * columns) * 4;
            return plotPoints;
        default:
            return 0;
    }
}
