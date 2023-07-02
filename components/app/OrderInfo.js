// libraries
import React, { Component } from 'react';
import { View, Text, Linking } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

// UI components
import Paragraph from '../UI/Paragraph';
import Link from '../UI/Link';
import Status from '../UI/Status';

// styles
import units from '../../components/styles/units';
import colors from '../../components/styles/colors';
import fonts from '../../components/styles/fonts';

// helpers
import formatWateringSchedule from '../../helpers/formatWateringSchedule';

// vars
import vars from '../../vars/index';

// types
import types from '../../vars/types';

class OrderInfo extends Component {

    formatOrderDescription(order) {
        const userType = (this.props.user.type !== types.CUSTOMER) ? 'vendor' : 'customer';
        if (order.type === types.YARD_ASSESSMENT) {
            return vars.orderDescriptions[userType].yardAssessment;
        } else if (order.type === types.CROP_ROTATION) {
            return vars.orderDescriptions[userType].cropRotation;
        } else if (order.type === types.FULL_PLAN) {
            return vars.orderDescriptions[userType].fullPlan;
        } else if (order.type === types.ASSISTED_PLAN) {
            return vars.orderDescriptions[userType].assistedPlan;
        } else if (order.type === types.INITIAL_PLANTING) {
            return vars.orderDescriptions[userType].initialPlanting;
        } else {
            return order.description;
        }
    }

    render() {

        const {
            order,
            wateringSchedule,
            onChangeDate,
            user
        } = this.props;

        const orderDescription = this.formatOrderDescription(order);
        let renderDateChange = false;
        if(
            user.type === types.CUSTOMER && 
            order.status === types.PENDING && 
            order.type === types.YARD_ASSESSMENT
        ) {
            renderDateChange = true;
        } else if(
            user.type === types.GARDENER &&
            order.status === types.PENDING && 
            (order.type === types.FULL_PLAN || order.type === types.ASSISTED_PLAN)
        ) {
            renderDateChange = true;
        }

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
                            {renderDateChange && (
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
                            Member/Address
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

                        {/* directions link */}
                        {user.type === 'gardener' && (
                            <View>
                                <Link
                                    text="Get Directions"
                                    onPress={() => {
                                        Linking.openURL(`http://maps.apple.com/?q=${encodeURIComponent(`${order.customer.address}, ${order.customer.city}, ${order.customer.state}`)}&dirflg=d`)
                                    }}
                                    icon={(
                                        <Ionicons
                                            name="navigate-circle-outline"
                                            size={units.unit4}
                                            color={colors.purpleB}
                                        />
                                    )}
                                />
                            </View>
                        )}

                        {/* watering schedule */}
                        {wateringSchedule?.length > 0 && (
                            <View>
                                <Paragraph style={{ ...fonts.label, marginTop: units.unit5 }}>
                                    Watering Schedule
                                </Paragraph>
                                <Text>{formatWateringSchedule(wateringSchedule[wateringSchedule.length - 1].result)}</Text>
                            </View>
                        )}

                    </View>
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

OrderInfo = connect(mapStateToProps, null)(OrderInfo);

export default OrderInfo;

module.exports = OrderInfo;