import React, { Component } from 'react';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../UI/Button';
import Paragraph from '../UI/Paragraph';
import Link from '../UI/Link';
import moment from 'moment';
import formatPhoneNumber from '../../helpers/formatPhoneNumber';
import getOrderDescription from '../../helpers/getOrderDescription';
import units from '../../components/styles/units';
import colors from '../../components/styles/colors';

class OrderInfo extends Component {

    render() {

        const {
            order,
            onChangeDate,
            onCancel
        } = this.props;

        return (
            <View>
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
                        <View style={{ marginBottom: units.unit3 }}>
                            <Button
                                text="Change Date"
                                onPress={() => onChangeDate()}
                                icon={(
                                    <Ionicons
                                        name="calendar-outline"
                                        size={units.unit4}
                                        color={colors.purpleB}
                                    />
                                )}
                            />
                        </View>
                        <View style={{ marginTop: units.unit4, display: 'flex', alignItems: 'center' }}>
                            <Link text="Cancel Order" onPress={() => onCancel()} />
                        </View>
                    </View>
                )}
            </View>
        )
    }
}

module.exports = OrderInfo;