import React, { Component } from 'react';
import { View } from 'react-native';
import Paragraph from '../../components/UI/Paragraph';
import formatPhoneNumber from '../../helpers/formatPhoneNumber';
import formatAddress from '../../helpers/formatAddress';

class ChangeOrderInfo extends Component {

    render() {

        const { changeOrder } = this.props;

        return (
            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                <View style={{ marginBottom: 12 }}>
                    <Paragraph style={{ fontWeight: 'bold', marginTop: 12 }}>Status</Paragraph>
                    <Paragraph>{changeOrder.status}</Paragraph>
                    <Paragraph style={{ fontWeight: 'bold', marginTop: 12 }}>Customer</Paragraph>
                    <Paragraph>
                        {changeOrder.order.customer.first_name} {changeOrder.order.customer.last_name}{"\n"}
                        {formatAddress(changeOrder.order.customer)}{"\n"}
                        {changeOrder.order.customer.email}{"\n"}
                        {formatPhoneNumber(changeOrder.order.customer.phone_number)}
                    </Paragraph>
                    <Paragraph style={{ fontWeight: 'bold', marginTop: 12 }}>Description</Paragraph>
                    <Paragraph>{changeOrder.description}</Paragraph>
                </View>
            </View>
        )
    }
}

module.exports = ChangeOrderInfo;