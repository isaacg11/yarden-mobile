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
  disabledDropdown: {
    borderWidth: 1,
    padding: units.unit4,
    borderColor: colors.purpleB50,
    backgroundColor: '#eeeeee',
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    fontSize: fonts.h4,
    marginBottom: units.unit2,
    color: colors.purpleB,
    fontWeight: 'bold',
  },
});

class Dropdown extends Component {
  render() {
    const {placeholder, options, onChange, value, disabled, style} = this.props;
    const dropdownStyle = (disabled) ? componentStyles.disabledDropdown : componentStyles.dropdown;

    return (
      <View>
        {this.props.label && (
          <Text style={fonts.inputLabel}>{this.props.label}</Text>
        )}

        <View style={{...dropdownStyle, ...style}}>
          <RNPickerSelect
            disabled={disabled}
            value={value}
            placeholder={placeholder ? {label: placeholder} : {label: ''}}
            onValueChange={value => onChange(value)}
            items={options}
            Icon={() => (
              <Ionicons
                name={'chevron-down'}
                color={disabled ? '#cccccc' : colors.purpleB}
                size={fonts.h2}
              />
            )}
            textInputProps={{
              style: {
                fontSize: fonts.h3,
                color: disabled ? '#cccccc' : 'black'
              },
            }}
          />
        </View>
      </View>
    );
  }
}

module.exports = Dropdown;
