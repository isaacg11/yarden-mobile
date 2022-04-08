import React, {Component} from 'react';
import {StyleSheet, TextInput, Text, View} from 'react-native';
import colors from '../styles/colors';
import units from '../styles/units';
import fonts from '../styles/fonts';

const componentStyles = StyleSheet.create({
  input: {
    marginBottom: units.unit4,
    borderBottomWidth: 1,
    padding: units.unit4,
    borderColor: colors.purpleB,
    padding: units.unit4,
    backgroundColor: colors.greenC10,
    fontSize: fonts.h3,
    fontFamily: fonts.default,
  },
  textarea: {
    height: units.unit6,
    marginTop: units.unit3,
    marginBottom: units.unit3,
    borderBottomWidth: 1,
    padding: units.unit4,
    borderColor: colors.purpleB,
    padding: units.unit4,
    backgroundColor: colors.greenC10,
  },
  //   label: {
  //     fontSize: fonts.h4,
  //     marginBottom: units.unit2,
  //     color: colors.purpleB,
  //     fontWeight: 'bold',
  //   },
});

class Input extends Component {
  render() {
    const {
      onChange,
      value,
      placeholder,
      type = 'default',
      onPressIn,
      password = false,
      multiline = false,
      numberOfLines = 1,
      disabled = false,
    } = this.props;

    return (
      <View>
        <Text style={fonts.inputLabel}>{this.props.label}</Text>
        <TextInput
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize="none"
          keyboardType={type}
          style={multiline ? componentStyles.textarea : componentStyles.input}
          onChangeText={value => onChange(value)}
          onPressIn={value => (onPressIn ? onPressIn(value) : null)}
          value={type === 'numeric' ? value.replace(/[^0-9]/g, '') : value}
          placeholder={placeholder}
          secureTextEntry={password}
          editable={disabled ? false : true}
          placeholderTextColor={colors.greenD25} //greenC-25
          selectionColor={colors.purple0} //purple0
        />
      </View>
    );
  }
}

module.exports = Input;
