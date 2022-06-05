import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import Divider from '../UI/Divider';
import Paragraph from '../UI/Paragraph';
import Link from '../UI/Link';
import Status from '../UI/Status';
import formatPhoneNumber from '../../helpers/formatPhoneNumber';
import units from '../../components/styles/units';
import colors from '../../components/styles/colors';
import fonts from '../../components/styles/fonts';
import vars from '../../vars/index';

class OrderInfo extends Component {

    formatOrderDescription(order) {
        if(order.type === 'yard assessment') {
            return vars.orderDescriptions.customer.yardAssessment;
        } else if(order.type === 'crop rotation') {
            return vars.orderDescriptions.customer.cropRotation;
        } else if(order.type === 'full plan') {
            return vars.orderDescriptions.customer.fullPlan;
        } else if(order.type === 'assisted plan') {
            return vars.orderDescriptions.customer.assistedPlan;
        } else if(order.type === 'initial planting') {
            return vars.orderDescriptions.customer.initialPlanting;
        } else {
            return order.description;
        }
    }

    render() {

        const {
            order,
            onChangeDate,
            onCancel,
        } = this.props;

        const orderDescription = this.formatOrderDescription(order);

        return (
            <View>
                <View>
                    <View>
                        <Paragraph
                            style={{
                                fontSize: fonts.h3,
                                textTransform: 'capitalize',
                                marginBottom: units.unit2,
                                color: colors.purpleD75,
                            }}>
                            {order.type}
                        </Paragraph>
                        <Status status={order.status} />
                        <Text style={{ ...fonts.label, marginTop: units.unit5 }}>
                            Description
                        </Text>
                        <Text>{orderDescription}</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: units.unit5 }}>
                            <View>
                                <Text style={{ ...fonts.label }}>
                                    Date
                                </Text>
                                <Text>
                                    {moment(order.date).format('MM/DD/YYYY')}
                                </Text>
                            </View>
                            {(order.status === 'pending' && order.type === 'yard assessment') && (
                                <Link
                                    text="Change"
                                    onPress={() => onChangeDate()}
                                    icon={(
                                        <Ionicons
                                            name="create-outline"
                                            size={units.unit4}
                                            color={colors.purpleB}
                                        />
                                    )}
                                />
                            )}

                        </View>
                        <Paragraph style={{ ...fonts.label, marginTop: units.unit5 }}>
                            Customer/Address
                        </Paragraph>

                        {/* name */}
                        <Text style={{ textTransform: 'capitalize' }}>
                            {order.customer.first_name} {order.customer.last_name}
                        </Text>

                        {/* address line 1 */}
                        <Text style={{ textTransform: 'capitalize' }}>{order.customer.address}</Text>

                        {/* address line 2 */}
                        {order.customer.unit && (
                            <Text style={{ textTransform: 'capitalize' }}>#{order.customer.unit}</Text>
                        )}
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            {/* City */}
                            <Text style={{ textTransform: 'capitalize' }}>{order.customer.city}, </Text>

                            {/* State */}
                            <Text style={{ textTransform: 'uppercase' }}>{order.customer.state} </Text>

                            {/* zip */}
                            <Text>{order.customer.zip_code}</Text>
                        </View>
                        <Text style={{ ...fonts.label, marginTop: units.unit5 }}>Email</Text>
                        <Text>{order.customer.email}</Text>
                        <Text style={{ marginBottom: units.unit4 }}>{formatPhoneNumber(order.customer.phone_number)}</Text>

                        {(order.status === 'pending' && order.type === 'yard assessment') && (
                            <View>
                                <Divider />
                                <View style={{ marginTop: units.unit5, marginBottom: units.unit5, display: 'flex', alignItems: 'center' }}>
                                    <Link text="Cancel Order" onPress={() => onCancel()} />
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        )
    }
}

module.exports = OrderInfo;