import ratio from '../styles/ratio';
import units from '../styles/units';
import colors from './colors';

const defaultFont = 'Futura-Medium';
const defaultBold = 'Futura-Bold';

// header sizes // don't change the order of these
const h6 = units.unit3;
const h5 = h6 * ratio.fontScaleRatio;
const h4 = h5 * ratio.fontScaleRatio;
const h3 = h4 * ratio.fontScaleRatio;
const h2 = h3 * ratio.fontScaleRatio;
const h1 = h2 * ratio.fontScaleRatio;
const h7 = (h6 * 3) / 4;
const h8 = (h7 * 3) / 4;

const paragraph = {
  fontSize: h3,
  lineHeight: h2,
  color: colors.greenE75,
  textTransform: 'capitalize',
};

const small = {
  fontSize: h5,
  lineHeight: h3,
  color: colors.greenE50,
};

const label = {
  fontSize: h5,
  lineHeight: h4,
  // marginBottom: units.unit1,
  color: colors.greenD50,
  fontFamily: defaultFont,
  textTransform: 'uppercase',
  letterSpacing: 1,
};

const inputLabel = {
  ...label,
  color: colors.purpleB,
  marginBottom: units.unit2,
};

const header = {
  fontSize: h2,
  lineHeight: h1,
  fontWeight: 'bold',
  color: colors.purpleE75,
  textTransform: 'capitalize',
  fontFamily: defaultFont,
};

const link = {
  purple: {
    fontSize: h4,
    lineHeight: h3,
    color: colors.purpleB,
    fontFamily: defaultFont,
  },
};

// fonts
const fonts = {
  default: defaultFont,
  bold: defaultBold,
  h6: h6,
  h5: h5,
  h4: h4,
  h3: h3,
  h2: h2,
  h1: h1,
  h7: h7,
  h8: h8,
  inputLabel: inputLabel,
  label: label,
  header: header,
  paragraph: paragraph,
  small: small,
  link: link,
};

export default fonts;
