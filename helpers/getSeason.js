// libs
import moment from 'moment';

// types
import types from '../vars/types';
const {FALL, SPRING} = types;

export default function getSeason() {
  const cold = [1, 8, 9, 10, 11, 12];
  const month = parseInt(moment().format('M'));
  const season = cold.includes(month) ? FALL : SPRING;
  return season;
}
