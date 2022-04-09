import React, {Component} from 'react';
import {Text} from 'react-native';
import {SvgCssUri} from 'react-native-svg';
import fonts from '../styles/fonts';
import colors from '../styles/colors';
import units from '../styles/units';

class CardBrand extends Component {
  getBrandLogo(brand) {
    switch (brand) {
      case 'mastercard':
        return 'https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/mastercard+(2).svg';
      case 'visa':
        return 'https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/visa.svg';
      case 'discover':
        return 'https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/discover+(4).svg';
      case 'american express':
        return 'https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/american_express+(1).svg';
      default:
        return 'https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/visa.svg';
    }
  }

  render() {
    const {brand} = this.props;
    const cardBrand = this.getBrandLogo(brand);

    // if brand {...}
    if (brand) {
      // render brand logo
      return <SvgCssUri uri={cardBrand} />;
    } else {
      // render text "LOGO"
      return (
        <Text
          style={{
            color: colors.purple0,
            fontFamily: fonts.default,
          }}>
          Select type...
        </Text>
      );
    }
  }
}

module.exports = CardBrand;
