
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import fonts from '../styles/fonts'


const componentStyles = StyleSheet.create({
    dropdown: {
        // marginTop: 12,
        // marginBottom: 12,
        borderWidth: 1,
        padding: 16,
        backgroundColor: 'red'
    }
});

class Dropdown extends Component {

    render() {

        const { 
            placeholder,
            options,
            onChange,
            value,
            disabled
        } = this.props;

        return (
            <View style={componentStyles.dropdown}>
                <RNPickerSelect
                    disabled={disabled}
                    value={value}
                    placeholder={(placeholder) ? {label: placeholder} : {label: ''}}
                    onValueChange={(value) => onChange(value)}
                    items={options}
                    textInputProps={{
                        style: {
                            fontFamily: fonts.default,
                            fontSize: fonts.h6,
                        }
                    }}
                />
            </View>
        )
    }
}

module.exports = Dropdown;