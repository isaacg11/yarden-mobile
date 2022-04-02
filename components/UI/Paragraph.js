
import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import fonts from '../styles/fonts';

const componentStyles = StyleSheet.create({
    paragraph: {
        fontFamily: fonts.default
    }
});

class Paragraph extends Component {

    render() {
        const { 
            children,
            style = {}
        } = this.props;

        const styles = {
            ...componentStyles.paragraph,
            ...style
        }
        
        return (
            <Text style={styles}>{children}</Text>
        )
    }
}

module.exports = Paragraph;