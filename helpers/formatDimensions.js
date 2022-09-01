export default function formatDimensions(gardenBed) {    
    switch (gardenBed.shape.name) {
        case 'rectangle':
            return `${gardenBed.width}" X ${gardenBed.length}" X ${gardenBed.height}"`;
        case 'square':
            return `${gardenBed.width}" X ${gardenBed.length}" X ${gardenBed.height}"`;
        case 'circle':
            return `${gardenBed.diameter}" (Diameter)`;
        case 'triangle':
            return `${gardenBed.side_1}" X ${gardenBed.side_2}" X ${gardenBed.side_3}" X ${gardenBed.height}"`;
        case 'U shape':
            return `${gardenBed.width_1}" X ${gardenBed.length_1}" X ${gardenBed.width_2}" X ${gardenBed.length_2}" X ${gardenBed.width_3}" X ${gardenBed.length_3}" X ${gardenBed.height}"`;
        case 'L shape':
            return `${gardenBed.width_1}" X ${gardenBed.length_1}" X ${gardenBed.width_2}" X ${gardenBed.length_2}" X ${gardenBed.height}"`;
        default:
            return ''
    }
}