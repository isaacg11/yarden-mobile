export default function formatWateringSchedule(wateringSchedule) {
    let scheduleDescription = '';

    // if days interval {...}
    if (wateringSchedule.days_interval) {

        // set description using days interval
        scheduleDescription += `Every ${wateringSchedule.days_interval} day${(wateringSchedule.days_interval > 1) ? 's' : ''}`;
    } else if (wateringSchedule.custom_intervals) { // if custom interval {...}

        // set description using custom interval
        scheduleDescription += (wateringSchedule.custom_intervals.monday) ? ' Monday'
            : '';
        scheduleDescription += (wateringSchedule.custom_intervals.tuesday) ? ' Tuesday'
            : '';
        scheduleDescription += (wateringSchedule.custom_intervals.wednesday) ? ' Wednesday'
            : '';
        scheduleDescription += (wateringSchedule.custom_intervals.thursday) ? ' Thursday'
            : '';
        scheduleDescription += (wateringSchedule.custom_intervals.friday) ? ' Friday'
            : '';
        scheduleDescription += (wateringSchedule.custom_intervals.saturday) ? ' Saturday'
            : '';
        scheduleDescription += (wateringSchedule.custom_intervals.sunday) ? ' Sunday'
            : '';

        const separatedDays = scheduleDescription.split(' ');
        scheduleDescription = 'Every ';

        separatedDays.forEach((day, index) => {
            if (day) {
                scheduleDescription += day;
                if (index !== separatedDays.length - 1) {
                    scheduleDescription += ', ';
                }
            }
        })
    }

    scheduleDescription += ` for ${wateringSchedule.minute_duration} minutes`;

    return scheduleDescription;
}