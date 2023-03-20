
// libraries
import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Label from '../UI/Label';

// styles
import units from '../styles/units';
import colors from '../styles/colors';

class Radio extends Component {

    state = {
        selectedOption: {}
    }

    componentDidMount() {
        if (this.props.defaultValue) {
            const match = this.props.options.find((option) => option.value === this.props.defaultValue);
            if (match) {
                this.setState({
                    selectedOption: match
                })
            }
        }
    }

    render() {

        const {
            options,
            onChange
        } = this.props;
        const { selectedOption } = this.state;

        return (
            <View>
                {options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingBottom: units.unit5
                        }}
                        onPress={() => {
                            this.setState({ selectedOption: option });
                            if (onChange) onChange(option.value);
                        }}>
                        <Ionicons
                            name={(selectedOption.value === option.value) ? 'radio-button-on' : 'radio-button-off'}
                            color={colors.purpleB}
                            size={units.unit4}
                        />
                        <View style={{ paddingLeft: units.unit3 }}>
                            <Label>{option.name}</Label>
                            {option.helperText && (
                                <Text>{option.helperText}</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        )
    }
}

export default Radio;