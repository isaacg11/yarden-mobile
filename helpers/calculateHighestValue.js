export default function calculateHighestValue(data, key) {
    let array = data;

    // Set the initial highest value to be the first object in the array
    let highestValue = array[0][key];

    // Loop through the array
    for (let i = 1; i < array.length; i++) {
        // If the current object's value for the specified key is higher than the current highest value, set the highest value to be the current object's value
        if (array[i][key] > highestValue) {
            highestValue = array[i][key];
        }
    }

    // Return the highest value
    return highestValue;
}