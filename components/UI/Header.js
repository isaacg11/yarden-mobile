
import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import ratio from '../styles/ratio';
import units from '../styles/units';
import fonts from '../styles/fonts';

// header sizes
const h6 = units.unit4;
const h5 = h6 * ratio.fontScaleRatio;
const h4 = h5 * ratio.fontScaleRatio;
const h3 = h4 * ratio.fontScaleRatio;
const h2 = h3 * ratio.fontScaleRatio;
const h1 = h2 * ratio.fontScaleRatio;

const componentStyles = StyleSheet.create({
    header: {
        fontFamily: fonts.default,
    }
});

class Header extends Component {

    getHeaderSize() {
        switch (this.props.type) {
            case 'h1':
                return h1;
            case 'h2':
                return h2;
            case 'h3':
                return h3;
            case 'h4':
                return h4;
            case 'h5':
                return h5;
            case 'h6':
                return h6;
            default:
                return h1;
        }
    }

    render() {
        const {
            children,
            style = {}
        } = this.props;

        const size = this.getHeaderSize();
        const styles = {
            ...{ fontSize: size },
            ...componentStyles.header,
            ...style
        }

        return (
            <Text style={styles}>{children}</Text>
        )
    }
}

module.exports = Header;