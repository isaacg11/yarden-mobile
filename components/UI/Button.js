
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import fonts from '../styles/fonts';
import Paragraph from './Paragraph';

const primaryButtonStyles = StyleSheet.create({
    button: {
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#1E6738',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    text: {
        color: '#fff',
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: fonts.default
    }
});

const secondaryButtonStyles = StyleSheet.create({
    button: {
        marginRight: 20,
        marginLeft: 20,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10
    },
    text: {
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: fonts.default
    }
});

const disabledButtonStyles = StyleSheet.create({
    button: {
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#DDDDDD',
        borderRadius: 10,
        borderWidth: 1,
    },
    text: {
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: fonts.default
    }
});

class Button extends Component {

    getButtonStyles(variant) {

        // if disabled, render disabled style
        if(this.props.disabled) return disabledButtonStyles;

        // render buttons styled based on variant
        switch(variant) {
            case 'primary':
                return primaryButtonStyles;
            case 'secondary': 
                return secondaryButtonStyles;
            default:
                return primaryButtonStyles; 
        }
    }

    render() {
        const { 
            onPress, 
            text = "Submit",
            variant,
            disabled,
            icon
        } = this.props;

        const buttonStyles = this.getButtonStyles(variant);

        return (
            <TouchableOpacity
                style={buttonStyles.button}
                onPress={(value) => onPress(value)}
                underlayColor='#fff'
                disabled={disabled}>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Paragraph style={buttonStyles.text}>{text}</Paragraph>{icon}
                </View>
            </TouchableOpacity>
        )
    }
}

module.exports = Button;