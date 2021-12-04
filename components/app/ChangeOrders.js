import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Button from '../UI/Button';
import Divider from '../UI/Divider';

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
                            <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Description</Text>
                            <Text>{changeOrder.description}</Text>
                            <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Status</Text>
                            <Text>{changeOrder.status}</Text>
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