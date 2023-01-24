import moment from 'moment';

export default async function groupByWeek(plantActivities) {
    // Create an empty object to store the grouped data
    const groupedData = {};

    // Loop through the array of objects
    plantActivities.forEach(item => {
        // Get the week number of the date using moment.js
        const weekNumber = moment(item.created_at).week();

        // Check if the week number already exists in the grouped data object
        if (!groupedData[weekNumber]) {
            // If not, create a new array for that week
            groupedData[weekNumber] = [];
        }

        // Push the item into the array for that week
        groupedData[weekNumber].push(item);
    });

    // Sort the keys of the object by week number
    const sortedWeekNumbers = Object.keys(groupedData).sort((a, b) => b - a);
    const currentWeek = moment().week();

    // sort the keys in calendar order
    let splitValue = `${currentWeek}`;
    let splitIndex = sortedWeekNumbers.indexOf(splitValue);
    let part1 = sortedWeekNumbers.slice(0, splitIndex);
    let part2 = sortedWeekNumbers.slice(splitIndex);
    const sortedWeeks = part2.concat(part1);

    let groupedSortedData = {};
    sortedWeeks.forEach((week) => {
        groupedSortedData[week] = groupedData[week];
    })

    // Return the grouped data object
    return groupedData;
}