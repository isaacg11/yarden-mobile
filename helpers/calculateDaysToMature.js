import moment from 'moment';

export default function calculateDaysToMature(plant) {
    const harvestDate = moment(plant.dt_planted).add(plant.id.days_to_mature, 'days');
    const diff = moment(harvestDate).diff(moment(), 'days');
    return diff;
}