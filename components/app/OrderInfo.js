import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Divider from '../UI/Divider';
import Button from '../UI/Button';
import moment from 'moment';
import formatPhoneNumber from '../../helpers/formatPhoneNumber';
import getOrderDescription from '../../helpers/getOrderDescription';

class OrderInfo extends Component {

    render() {

        const { 
            order, 
            onChangeDate,
            onCancel
        } = this.props;

        return (
            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Service</Text>
                    <Text>{order.type}</Text>
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Status</Text>
                    <Text>{order.status}</Text>
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Date</Text>
                    <Text>{moment(order.date).format('MM/DD/YYYY')} {(order.time) ? `@ ${moment(order.time, `HH:mm:ss`).format(`h:mm A`)}` : ''}</Text>
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Customer</Text>
                    <Text>
                        {order.customer.first_name} {order.customer.last_name}{"\n"}
                        {order.customer.address}{(order.customer.unit) ? ` #${order.customer.unit}` : ''}, {order.customer.city} {order.customer.state} {order.customer.zip_code}{"\n"}
                        {order.customer.email}{"\n"}
                        {formatPhoneNumber(order.customer.phone_number)}
                    </Text>
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Description</Text>
                    <Text>{getOrderDescription(order)}</Text>
                </View>
                {(order.status === 'pending' && order.type === 'yard assessment') && (
                    <View>
                        <Divider />
                        <View style={{ marginBottom: 12 }}>
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