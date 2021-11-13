import moment from 'moment';

export default function getSeason() {
    const cold = [1, 8, 9, 10, 11, 12];
    const month = parseInt((moment().format('M')));
    const season = (cold.includes(month)) ? 'cold' : 'warm';
    return season;
}