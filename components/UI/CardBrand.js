import React, { Component } from 'react';
import {Text} from 'react-native';
import { SvgCssUri } from 'react-native-svg';
import fonts from '../styles/fonts';
import colors from '../styles/colors';

class CardBrand extends Component {

    getBrandLogo(brand) {
        switch (brand) {
            case 'mastercard':
                return 'https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/icons8-mastercard.svg';
            case 'visa':
                return 'https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/icons8-visa.svg';
            case 'discover':
                return 'https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/icons8-discover+(1).svg';
            case 'american express':
                return 'https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/icons8-american-express.svg';
            default:
                return 'https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/icons8-visa.svg';
        }
    }

    render() {

        const { brand } = this.props;
        const cardBrand = this.getBrandLogo(brand);

        // if brand {...}
        if (brand) {

            // render brand logo
            return (
                <SvgCssUri
                    width="100%"
                    height="100%"
                    uri={cardBrand}
                />
            );
        } else {

            // render text "LOGO"
            return (
                <Text
                    style={{
                        color: colors.purple0,
                        fontWeight: 'bold',
                        fontFamily: fonts.default,
                    }}>
                    LOGO
                </Text>
            )
        }


    }
}

module.exports = CardBrand;
