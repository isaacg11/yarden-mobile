
import React, { Component } from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment-timezone';
import Input from './Input';
import Paragraph from './Paragraph';

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

        return (
            <View>
                <Input
                    label="Date"
                    value={value}
                    placeholder={placeholder}
                    onPressIn={() => this.setState({ datePickerIsOpen: true })}
                    onChange={() => this.setState({ datePickerIsOpen: true })}
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