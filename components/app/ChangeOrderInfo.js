import React, { Component } from 'react';
import { View, Text } from 'react-native';
import formatPhoneNumber from '../../helpers/formatPhoneNumber';
import formatAddress from '../../helpers/formatAddress';

class ChangeOrderInfo extends Component {

    render() {

        const { changeOrder } = this.props;

        return (
            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Status</Text>
                    <Text>{changeOrder.status}</Text>
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Customer</Text>
                    <Text>
                        {changeOrder.order.customer.first_name} {changeOrder.order.customer.last_name}{"\n"}
                        {formatAddress(changeOrder.order.customer)}{"\n"}
                        {changeOrder.order.customer.email}{"\n"}
                        {formatPhoneNumber(changeOrder.order.customer.phone_number)}
                    </Text>
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Description</Text>
                    <Text>{changeOrder.description}</Text>
                </View>
            </View>
        )
    }
}

module.exports = ChangeOrderInfo;