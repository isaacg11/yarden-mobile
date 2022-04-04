import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import fonts from '../styles/fonts';
import units from '../styles/units';
import colors from '../styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const componentStyles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    padding: units.unit4,
    borderColor: colors.purpleB,
    backgroundColor: colors.greenC10,
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    fontSize: fonts.h4,
    marginBottom: units.unit2,
  },
});

class Dropdown extends Component {
  render() {
    const {placeholder, options, onChange, value, disabled} = this.props;

    return (
      <View>
        {this.props.label && (
          <Text style={componentStyles.label}>{this.props.label}</Text>
        )}

        <View style={componentStyles.dropdown}>
          <RNPickerSelect
            disabled={disabled}
            value={value}
            placeholder={placeholder ? {label: placeholder} : {label: ''}}
            onValueChange={value => onChange(value)}
            items={options}
            Icon={() => <Ionicons name={'chevron-down'} size={fonts.h2} />}
            textInputProps={{
              style: {
                fontFamily: fonts.default,
                fontSize: fonts.h3,
              },
            }}
          />
        </View>
      </View>
    );
  }
}

module.exports = Dropdown;
