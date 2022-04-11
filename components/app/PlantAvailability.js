import React, { Component } from 'react';
import config from '../../config/index';
import Paragraph from '../UI/Paragraph';
import Card from '../UI/Card';
import units from '../../components/styles/units';

class PlantAvailability extends Component {

    render() {

        return (
            <Card>
                <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5, marginBottom: units.unit5 }}>Plant Availability</Paragraph>
                <Paragraph style={{ marginBottom: units.unit5 }}>
                    Please note that some plants will only grow in specific climates or seasons. If you do not see something you want on the list it will probably be available next season or does grow in your region.
                    If you have any questions, please reach out to Yarden support at {config.email}.
                </Paragraph>
            </Card>
        )
    }
}

module.exports = PlantAvailability;