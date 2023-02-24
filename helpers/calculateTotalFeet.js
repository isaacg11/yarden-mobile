import convertInchesToFeet from "./convertInchesToFeet";

export default function calculateTotalFeet(beds) {

    // set initial dimensions
    let sqft = 0;
    let cf = 0;
    let vf = 0;
    let lf = 0;

    // iterate through beds
    beds.forEach((bed) => {

        // set bed shape (NOTE: this is necessary because when we upload results we use bed.shape, but for all other operations we use via bed.shape.name)
        const bedShape = (typeof bed.shape === 'object') ? bed.shape.name : bed.shape;

        // set vertical feet
        vf += (bed.qty * convertInchesToFeet(bed.height));

        switch (bedShape) {
            case 'rectangle':
                // set square, cubic, and linear feet
                sqft += (bed.qty * (convertInchesToFeet(bed.width) * convertInchesToFeet(bed.length)));
                cf += (bed.qty * (convertInchesToFeet(bed.width) * convertInchesToFeet(bed.length) * convertInchesToFeet(bed.height)));
                lf += (bed.qty * convertInchesToFeet(bed.length));
                break;
            case 'square':
                // set square, cubic, and linear feet
                sqft += (bed.qty * (convertInchesToFeet(bed.width) * convertInchesToFeet(bed.length)));
                cf += (bed.qty * (convertInchesToFeet(bed.width) * convertInchesToFeet(bed.length) * convertInchesToFeet(bed.height)));
                lf += (bed.qty * convertInchesToFeet(bed.length));
                break;
            case 'circle':
                // set square, cubic, and linear feet
                sqft += (bed.qty * (convertInchesToFeet(bed.diameter) * 2));
                cf += (bed.qty * ((convertInchesToFeet(bed.diameter) * 2) * convertInchesToFeet(bed.height)));
                lf += (bed.qty * convertInchesToFeet(bed.diameter));
                break;
            case 'triangle':
                // set square, cubic, and linear feet
                sqft += (bed.qty * Math.floor(calculateTriangle(bed)));
                cf += (bed.qty * (Math.floor(calculateTriangle(bed)) * convertInchesToFeet(bed.height)));
                const sides = [bed.side_1, bed.side_2, bed.side_3];
                const largestSide = Math.max.apply(null, sides);
                lf += (bed.qty * convertInchesToFeet(largestSide));
                break;
            case 'U shape':
                // set square, cubic, and linear feet
                sqft += Math.floor(bed.qty * calculateUShape(bed));
                cf += (bed.qty * (Math.floor(calculateUShape(bed)) * convertInchesToFeet(bed.height)));
                lf += (bed.qty * (Math.floor(calculateUShape(bed)) / convertInchesToFeet(bed.width_1)));
                break;
            case 'L shape':
                // set square, cubic, and linear feet
                sqft += Math.floor(bed.qty * calculateLShape(bed));
                cf += (bed.qty * (Math.floor(calculateLShape(bed)) * convertInchesToFeet(bed.height)));
                lf += (bed.qty * (Math.floor(calculateLShape(bed)) / convertInchesToFeet(bed.width_1)));
                break;
            default:
                sqft += 0;
                cf += 0;
                vf += 0;
                lf += 0;
        }
    })

    return {
        sqft,
        cf,
        vf,
        lf
    };
}

function calculateTriangle(bed) {
    let sqft = 0;
    const side1 = convertInchesToFeet(bed.side_1);
    const side2 = convertInchesToFeet(bed.side_2);
    const side3 = convertInchesToFeet(bed.side_3);
    const s = (side1 + side2 + side3) / 2;
    const area = Math.sqrt((s * (s - side1)) + (s * (s - side2)) + (s * (s - side3)));
    const width = area / 2;
    const length = area / 2;
    sqft += (width * length);

    return sqft;
}

function calculateUShape(bed) {
    const section1 = convertInchesToFeet(bed.width_1) * convertInchesToFeet(bed.length_1);
    const section2 = (convertInchesToFeet(bed.length_3) - convertInchesToFeet(bed.length_2)) * convertInchesToFeet(bed.width_2);
    const section3 = convertInchesToFeet(bed.width_3) * convertInchesToFeet(bed.length_3);
    const sqft = section1 + section2 + section3;

    return sqft;
}

function calculateLShape(bed) {
    const section1 = convertInchesToFeet(bed.width_1) * (convertInchesToFeet(bed.length_1) - convertInchesToFeet(bed.width_2));
    const section2 = convertInchesToFeet(bed.width_1) * convertInchesToFeet(bed.width_2);
    const section3 = convertInchesToFeet(bed.width_2) * (convertInchesToFeet(bed.length_2) - convertInchesToFeet(bed.width_1));
    const sqft = section1 + section2 + section3;

    return sqft;
}