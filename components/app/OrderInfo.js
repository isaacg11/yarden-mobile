import React, { Component } from 'react';
import { View } from 'react-native';
import Divider from '../UI/Divider';
import Button from '../UI/Button';
import Paragraph from '../UI/Paragraph';
import moment from 'moment';
import formatPhoneNumber from '../../helpers/formatPhoneNumber';
import getOrderDescription from '../../helpers/getOrderDescription';
import units from '../../components/styles/units';

class OrderInfo extends Component {

    render() {

        const { 
            order, 
            onChangeDate,
            onCancel
        } = this.props;

        return (
            <View style={{ backgroundColor: '#fff', padding: units.unit5, borderRadius: 5 }}>
                <View style={{ marginBottom: units.unit5 }}>
                    <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Service</Paragraph>
                    <Paragraph>{order.type}</Paragraph>
                    <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Status</Paragraph>
                    <Paragraph>{order.status}</Paragraph>
                    <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Date</Paragraph>
                    <Paragraph>{moment(order.date).format('MM/DD/YYYY')} {(order.time) ? `@ ${moment(order.time, `HH:mm:ss`).format(`h:mm A`)}` : ''}</Paragraph>
                    <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Customer</Paragraph>
                    <Paragraph>
                        {order.customer.first_name} {order.customer.last_name}{"\n"}
                        {order.customer.address}{(order.customer.unit) ? ` #${order.customer.unit}` : ''}, {order.customer.city} {order.customer.state} {order.customer.zip_code}{"\n"}
                        {order.customer.email}{"\n"}
                        {formatPhoneNumber(order.customer.phone_number)}
                    </Paragraph>
                    <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Description</Paragraph>
                    <Paragraph>{getOrderDescription(order)}</Paragraph>
                </View>
                {(order.status === 'pending' && order.type === 'yard assessment') && (
                    <View>
                        <Divider />
                        <View style={{ marginBottom: units.unit5 }}>
                            <Button
                                text="Change Date"
                                onPress={() => onChangeDate()}
                                variant="secondary"
                            />
                        </View>
                        <Divider />
                        <View>
                            <Button
                                text="Cancel Order"
                                onPress={() => onCancel()}
                                variant="secondary"
                            />
                        </View>
                    </View>
                )}
            </View>
        )
    }
}

module.exports = OrderInfo;