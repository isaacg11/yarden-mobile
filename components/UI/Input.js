
import React, { Component } from 'react';
import { StyleSheet, TextInput } from 'react-native';

const componentStyles = StyleSheet.create({
    input: {
        height: 40,
        marginTop: 12,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10
    },
    textarea: {
        height: 60,
        marginTop: 12,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10
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
            numberOfLines = 1
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
            />
        )
    }
}

module.exports = Input;