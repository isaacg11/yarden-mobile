// libraries
import React, { Component } from 'react';
import { View, StyleSheet, Switch, Text } from 'react-native';
import units from '../styles/units';

// UI components
import Label from '../UI/Label';

// styles
import colors from '../styles/colors';

class ToggleSwitch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOn: false
        };
    }

    handleToggle = () => {
        this.setState(prevState => ({
            isOn: !prevState.isOn
        }), () => {
            this.props.onChange(this.state.isOn);
        });
    }

    render() {
        const { thumbLabel, trackLabel } = this.props;

        return (
            <View style={styles.container}>
                {this.state.isOn ? (
                    <Label>{thumbLabel}</Label>
                ) : (
                    <Label>{trackLabel}</Label>
                )}
                <Switch
                    trackColor={{ true: colors.purpleB }}
                    onValueChange={this.handleToggle}
                    value={this.state.isOn}
                    style={{marginLeft: units.unit3}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 20,
        color: '#000',
    },
});

export default ToggleSwitch;
