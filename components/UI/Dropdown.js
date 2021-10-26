
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const componentStyles = StyleSheet.create({
    dropdown: {
        height: 40,
        marginTop: 12,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10
    }
});

class Dropdown extends Component {

    render() {

        const { 
            placeholder,
            options,
            onChange,
            value
        } = this.props;

        return (
            <View style={componentStyles.dropdown}>
                <RNPickerSelect
                    value={value}
                    placeholder={{label: placeholder}}
                    onValueChange={(value) => onChange(value)}
                    items={options}
                />
            </View>
        )
    }
}

module.exports = Dropdown;