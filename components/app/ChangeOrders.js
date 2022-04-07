import React, { Component } from 'react';
import { View } from 'react-native';
import Button from '../UI/Button';
import Divider from '../UI/Divider';
import Paragraph from '../UI/Paragraph';
import units from '../../components/styles/units';

class ChangeOrders extends Component {

    render() {

        const {
            changeOrders,
            onPress
        } = this.props;

        return (
            <View style={{ padding: units.unit5 }}>
                {changeOrders.map((changeOrder, index) => (
                    <View key={index}>
                        <View style={{ marginBottom: units.unit5 }}>
                            <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Description</Paragraph>
                            <Paragraph>{changeOrder.description}</Paragraph>
                            <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Status</Paragraph>
                            <Paragraph>{changeOrder.status}</Paragraph>
                        </View>
                        <Divider />
                        <View>
                            <Button
                                text="View Details"
                                onPress={() => onPress(changeOrder)}
                                variant="secondary"
                            />
                        </View>
                    </View>
                ))}
            </View>
        )
    }
}

module.exports = ChangeOrders;