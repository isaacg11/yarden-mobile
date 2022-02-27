import convertInchesToFeet from './convertInchesToFeet';

export default function getProductMeasurements(dimensions, qty) {

    // convert dimensions to feet
    const width = convertInchesToFeet(dimensions.width);
    const length = convertInchesToFeet(dimensions.length);
    const height = convertInchesToFeet(dimensions.height);

    // set measurements
    const sqft = (qty * (width * length));
    const cf = (qty * (width * length * height));
    const vf = (qty * height);
    const lf = (qty * length);

    return {
        sqft,
        cf,
        vf,
        lf
    }
}