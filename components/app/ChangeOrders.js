import React, { Component } from 'react';
import { View } from 'react-native';
import Button from '../UI/Button';
import Divider from '../UI/Divider';
import Paragraph from '../UI/Paragraph';

class ChangeOrders extends Component {

    render() {

        const {
            changeOrders,
            onPress
        } = this.props;

        return (
            <View style={{ padding: 12 }}>
                {changeOrders.map((changeOrder, index) => (
                    <View key={index}>
                        <View style={{ marginBottom: 12 }}>
                            <Paragraph style={{ fontWeight: 'bold', marginTop: 12 }}>Description</Paragraph>
                            <Paragraph>{changeOrder.description}</Paragraph>
                            <Paragraph style={{ fontWeight: 'bold', marginTop: 12 }}>Status</Paragraph>
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