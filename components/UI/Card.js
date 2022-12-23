import React, { Component } from 'react';
import { View } from 'react-native';
import card from '../styles/card';

class Card extends Component {

    render() {
        const { children, style } = this.props;

        return (
            <View style={{...card, ...style}}>
                {children}
            </View>
        );
    }
}

module.exports = Card;
