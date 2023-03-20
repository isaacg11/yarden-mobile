// libraries
import React, { Component } from 'react';
import { View, Text } from 'react-native';
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

class ReminderInfo extends Component {

    formatOrderDescription(order) {
        const userType = (this.props.user.type !== 'customer') ? 'vendor' : 'customer';
        if (order.type === 'yard assessment') {
            return vars.orderDescriptions[userType].yardAssessment;
        } else if (order.type === 'crop rotation') {
            return vars.orderDescriptions[userType].cropRotation;
        } else if (order.type === 'full plan') {
            return vars.orderDescriptions[userType].fullPlan;
        } else if (order.type === 'assisted plan') {
            return vars.orderDescriptions[userType].assistedPlan;
        } else if (order.type === 'initial planting') {
            return vars.orderDescriptions[userType].initialPlanting;
        } else {
            return order.description;
        }
    }

    render() {

        const {
            reminder
        } = this.props;

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
                            {reminder.title}
                        </Paragraph>
                        <Status status={reminder.status} />
                        <Text style={{ ...fonts.label, marginTop: units.unit5 }}>
                            Description
                        </Text>
                        <Text>{reminder.description}</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: units.unit5 }}>
                            <View>
                                <Text style={{ ...fonts.label }}>
                                    Date
                                </Text>
                                <Text>
                                    {moment(reminder.date).format('MM/DD/YYYY')}
                                </Text>
                            </View>
                        </View>
                        <Paragraph style={{ ...fonts.label, marginTop: units.unit5 }}>
                            Customer/Address
                        </Paragraph>

                        {/* name */}
                        <Text style={{ textTransform: 'capitalize' }}>
                            {reminder.customer.first_name} {reminder.customer.last_name}
                        </Text>

                        {/* address line 1 */}
                        <Text style={{ textTransform: 'capitalize' }}>{reminder.customer.address}</Text>

                        {/* address line 2 */}
                        {reminder.customer.unit && (
                            <Text style={{ textTransform: 'capitalize' }}>#{reminder.customer.unit}</Text>
                        )}
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            {/* City */}
                            <Text style={{ textTransform: 'capitalize' }}>{reminder.customer.city}, </Text>

                            {/* State */}
                            <Text style={{ textTransform: 'uppercase' }}>{reminder.customer.state} </Text>

                            {/* zip */}
                            <Text>{reminder.customer.zip_code}</Text>
                        </View>

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

ReminderInfo = connect(mapStateToProps, null)(ReminderInfo);

export default ReminderInfo;

module.exports = ReminderInfo;