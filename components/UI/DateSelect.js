
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment-timezone';
import Input from './Input';

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
            date
        } = this.props;

        const {
            datePickerIsOpen,
            validationError
        } = this.state;

        console.log(minDate)

        return (
            <View>
                <Input
                    onPressIn={() => this.setState({datePickerIsOpen: true})}
                    value={value}
                    placeholder={placeholder}
                />
                <DatePicker
                    modal
                    mode={mode}
                    open={datePickerIsOpen}
                    date={date}
                    minimumDate={minDate}
                    maximumDate={maxDate}
                    onConfirm={async (info) => {

                        // close date picker
                        await this.setState({datePickerIsOpen: false});

                        await this.setState({
                            validationError: false
                        })

                        // save info to local state
                        onConfirm(moment(info).tz('America/Los_Angeles'));
                        
                    }}
                    onCancel={() => {}}
                />
                {(validationError) && (
                    <Text>{validationError}</Text>
                )}
            </View>
        )
    }
}

module.exports = DateSelect;