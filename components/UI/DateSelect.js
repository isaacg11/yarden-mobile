
import React, { Component } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment-timezone';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Input from './Input';
import Label from './Label';
import Paragraph from './Paragraph';
import units from '../styles/units';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

const dropdownStyles = StyleSheet.create({
    dropdown: {
        borderWidth: 1,
        padding: units.unit4,
        borderColor: colors.purpleB,
        backgroundColor: colors.greenC10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    label: {
        fontSize: fonts.h4,
        marginBottom: units.unit2,
        color: colors.purpleB,
        fontWeight: 'bold',
    },
});

class DateSelect extends Component {

    state = {}

    render() {

        const {
            placeholder,
            onConfirm,
            value,
            minDate = null,
            maxDate = null,
            mode,
            date,
            appearance
        } = this.props;

        const {
            datePickerIsOpen,
            validationError
        } = this.state;

        const isNewDate = moment(value).format('MM/DD/YYYY') !== moment().format('MM/DD/YYYY');

        return (
            <View>
                {appearance === 'dropdown' ? (
                    <Pressable onPressIn={() => this.setState({ datePickerIsOpen: true })}>
                        <Label style={{ color: colors.purpleB, marginBottom: units.unit2, }}>DATE</Label>
                        <View style={dropdownStyles.dropdown}>
                            <Text style={{ fontSize: fonts.h3 }}>
                                {
                                    isNewDate ?
                                    moment(value).format('MM/DD/YYYY') :
                                    'Choose a new date...'
                                }
                            </Text>
                            <Ionicons
                                name="chevron-down-outline"
                                size={units.unit4 + units.unit3}
                                color={colors.purpleB}
                            />
                        </View>
                    </Pressable>
                ) :
                    <Input
                        label="Date"
                        value={value}
                        placeholder={placeholder}
                        onPressIn={() => this.setState({ datePickerIsOpen: true })}
                        onChange={() => this.setState({ datePickerIsOpen: true })}
                    />
                }                
                <DatePicker
                    modal
                    mode={mode}
                    open={datePickerIsOpen}
                    date={new Date(isNewDate ? value : date)}
                    minimumDate={minDate}
                    maximumDate={maxDate}
                    onConfirm={async (info) => {

                        // close date picker
                        await this.setState({ datePickerIsOpen: false });

                        await this.setState({
                            validationError: false
                        })

                        // save info to local state
                        onConfirm(moment(info).tz('America/Los_Angeles'));

                    }}
                    onCancel={() => { }}
                />
                {(validationError) && (
                    <Paragraph>{validationError}</Paragraph>
                )}
            </View>
        )
    }
}

module.exports = DateSelect;