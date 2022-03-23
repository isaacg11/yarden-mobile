
import React, { Component } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import fonts from '../styles/fonts';

const componentStyles = StyleSheet.create({
    input: {
        height: 40,
        marginTop: 12,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10,
        fontFamily: fonts.default
    },
    textarea: {
        height: 60,
        marginTop: 12,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10,
        fontFamily: fonts.default
    }
});

class Input extends Component {

    render() {

        const { 
            onChange, 
            value, 
            placeholder,
            type = "default",
            onPressIn,
            password = false,
            multiline = false,
            numberOfLines = 1,
            disabled = false
        } = this.props;

        return (
            <TextInput
                multiline={multiline}
                numberOfLines={numberOfLines}
                autoCapitalize='none'
                keyboardType={type}
                style={(multiline) ? componentStyles.textarea : componentStyles.input}
                onChangeText={(value) => onChange(value)}
                onPressIn={(value) => onPressIn ? onPressIn(value) : null}
                value={(type === 'numeric') ? value.replace(/[^0-9]/g, '') : value}
                placeholder={placeholder}
                secureTextEntry={password}
                editable={disabled ? false : true}
                placeholderTextColor='hsla(120,100%,20%, 0.25)' //purpleB
                selectionColor={'hsl(260,100%,50%)'} //purple0
            />
        )
    }
}

module.exports = Input;