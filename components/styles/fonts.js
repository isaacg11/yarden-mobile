import ratio from '../styles/ratio';
import units from '../styles/units';
import colors from './colors';

// header sizes
const h6 = units.unit3;
const h5 = h6 * ratio.fontScaleRatio;
const h4 = h5 * ratio.fontScaleRatio;
const h3 = h4 * ratio.fontScaleRatio;
const h2 = h3 * ratio.fontScaleRatio;
const h1 = h2 * ratio.fontScaleRatio;
const h7 = (h6 * 3) / 4;
const h8 = (h7 * 3) / 4; // since we're using a 'perfect fourth' ratio, scaling these fonts down from h6 means using 3/4 instead of 1 + (1/3)

const label = {
  fontSize: h4,
  marginBottom: units.unit2,
  color: colors.greenC50,
  fontFamily: 'Futura-Medium',
  textTransform: 'uppercase',
  letterSpacing: 1,
};

const inputLabel = {
  ...label,
  color: colors.purpleB,
};

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
  inputLabel: inputLabel,
};

export default fonts;
