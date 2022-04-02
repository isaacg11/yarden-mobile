import React, { Component } from 'react';
import { View } from 'react-native';
import config from '../../config/index';
import Paragraph from '../UI/Paragraph';

class PlantAvailability extends Component {

    render() {

        return (
            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                <Paragraph style={{ fontWeight: 'bold', marginTop: 12, marginBottom: 12 }}>Plant Availability</Paragraph>
                <Paragraph style={{ marginBottom: 12 }}>
                    Please note that some plants will only grow in specific climates or seasons. If you do not see something you want on the list it will probably be available next season or does grow in your region.
                    If you have any questions, please reach out to Yarden support at {config.email}.
                </Paragraph>
            </View>
        )
    }
}

module.exports = PlantAvailability;