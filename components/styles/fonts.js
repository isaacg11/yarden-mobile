import ratio from '../styles/ratio';
import units from '../styles/units';

// header sizes
const h6 = units.unit3;
const h5 = h6 * ratio.fontScaleRatio;
const h4 = h5 * ratio.fontScaleRatio;
const h3 = h4 * ratio.fontScaleRatio;
const h2 = h3 * ratio.fontScaleRatio;
const h1 = h2 * ratio.fontScaleRatio;
const h7 = (h6 * 2) / 3;
const h8 = (h7 * 2) / 3;

// fonts
const fonts = {
  default: 'Futura-Medium',
  bold: 'Futura-Bold',
  h6: h6,
  h5: h5,
  h4: h4,
  h3: h3,
  h2: h2,
  h1: h1,
  h7: h7,
  h8: h8,
};

export default fonts;
