import React, { Component } from 'react';
import { View, Text } from 'react-native';
import config from '../../config/index';

class PlantAvailability extends Component {

    render() {

        return (
            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                <Text style={{ fontWeight: 'bold', marginTop: 12, marginBottom: 12 }}>Plant Availability</Text>
                <Text style={{ marginBottom: 12 }}>
                    Please note that some plants will only grow in specific climates or seasons. If you do not see something you want on the list it will probably be available next season or does grow in your region.
                    If you have any questions, please reach out to Yarden support at {config.email}.
                </Text>
            </View>
        )
    }
}

module.exports = PlantAvailability;