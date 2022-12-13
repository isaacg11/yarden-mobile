import convertInchesToFeet from '../helpers/convertInchesToFeet';

export default function formatDimensions(gardenBed) {
  switch (gardenBed.shape.name) {
    case 'rectangle':
      return `${convertInchesToFeet(gardenBed.width)}" X ${convertInchesToFeet(
        gardenBed.length,
      )}" X ${convertInchesToFeet(gardenBed.height)}"`;
    case 'square':
      return `${convertInchesToFeet(gardenBed.width)}" X ${convertInchesToFeet(
        gardenBed.length,
      )}" X ${convertInchesToFeet(gardenBed.height)}"`;
    case 'circle':
      return `${convertInchesToFeet(gardenBed.diameter)}" (Diameter)`;
    case 'triangle':
      return `${convertInchesToFeet(gardenBed.side_1)}" X ${convertInchesToFeet(
        gardenBed.side_2,
      )}" X ${convertInchesToFeet(gardenBed.side_3)}" X ${convertInchesToFeet(
        gardenBed.height,
      )}"`;
    case 'U shape':
      return `${convertInchesToFeet(
        gardenBed.width_1,
      )}" X ${convertInchesToFeet(gardenBed.length_1)}" X ${convertInchesToFeet(
        gardenBed.width_2,
      )}" X ${convertInchesToFeet(gardenBed.length_2)}" X ${convertInchesToFeet(
        gardenBed.width_3,
      )}" X ${convertInchesToFeet(gardenBed.length_3)}" X ${convertInchesToFeet(
        gardenBed.height,
      )}"`;
    case 'L shape':
      return `${convertInchesToFeet(
        gardenBed.width_1,
      )}" X ${convertInchesToFeet(gardenBed.length_1)}" X ${convertInchesToFeet(
        gardenBed.width_2,
      )}" X ${convertInchesToFeet(gardenBed.length_2)}" X ${convertInchesToFeet(
        gardenBed.height,
      )}"`;
    default:
      return '';
  }
}
