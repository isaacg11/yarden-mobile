import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Status from '../../components/UI/Status';
import Label from '../../components/UI/Label';
import formatPhoneNumber from '../../helpers/formatPhoneNumber';
import formatAddress from '../../helpers/formatAddress';
import units from '../../components/styles/units';

class ChangeOrderInfo extends Component {

    render() {

        const { changeOrder } = this.props;

        return (
            <View>
                <View style={{ marginBottom: units.unit5 }}>
                    <Label style={{ marginTop: units.unit5 }}>Status</Label>
                    <Status status={changeOrder.status} />
                    <Label style={{ marginTop: units.unit5 }}>Customer</Label>
                    <Text>
                        {changeOrder.order.customer.first_name} {changeOrder.order.customer.last_name}{"\n"}
                        {formatAddress(changeOrder.order.customer)}{"\n"}
                        {changeOrder.order.customer.email}{"\n"}
                        {formatPhoneNumber(changeOrder.order.customer.phone_number)}
                    </Text>
                    <Label style={{ marginTop: units.unit5 }}>Description</Label>
                    <Text>{changeOrder.description}</Text>
                </View>
            </View>
        )
    }
}

module.exports = ChangeOrderInfo;