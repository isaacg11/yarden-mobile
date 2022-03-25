
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import fonts from '../styles/fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';


const componentStyles = StyleSheet.create({
    dropdown: {
        // marginTop: 12,
        // marginBottom: 12,
        borderWidth: 1,
        padding: 16,
        borderColor: '#330099', // green0
        padding: 16,
        backgroundColor: 'hsla(120,100%,20%, 0.1)', // greenC-10
        display: 'flex',
        alignItems: 'center',
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
                    Icon={() => <Ionicons name={'chevron-down'} size={20} />}
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