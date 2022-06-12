import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Divider from '../UI/Divider';
import Status from '../UI/Status';
import Label from '../UI/Label';
import Link from '../UI/Link';
import units from '../../components/styles/units';

class ChangeOrders extends Component {

    render() {

        const {
            changeOrders,
            onPress
        } = this.props;

        return (
            <View>
                {changeOrders.map((changeOrder, index) => (
                    <View key={index}>
                        <View style={{ marginBottom: units.unit5 }}>
                            <Label style={{ marginTop: units.unit5 }}>Status</Label>
                            <Status status={changeOrder.status} />
                            <Label style={{ marginTop: units.unit5 }}>Description</Label>
                            <Text>{changeOrder.description}</Text>
                        </View>
                        <View>
                            <Divider />
                            <View style={{ marginTop: units.unit5, display: 'flex', alignItems: 'center' }}>
                                <Link text="View Details" onPress={() => onPress(changeOrder)} />
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        )
    }
}

module.exports = ChangeOrders;