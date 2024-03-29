// libs
import React from 'react';
import {Text} from 'react-native';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

const SuccessIndicator = () => {
  return (
    <Text
      style={{
        fontSize: fonts.h1,
        textAlign: 'center',
        color: colors.purpleB,
      }}>
      ٩( ᐛ )و
    </Text>
  );
};

export default SuccessIndicator;
