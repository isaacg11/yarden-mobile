
import React, { Component } from 'react';
import { Text, SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Divider from '../components/UI/Divider';
import Button from '../components/UI/Button';
import { alert } from '../components/UI/SystemAlert';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import ImageGrid from '../components/app/ImageGrid';
import formatPhoneNumber from '../helpers/formatPhoneNumber';
import getOrderDescription from '../helpers/getOrderDescription';
import { getOrders, updateOrder } from '../actions/orders/index';

class OrderDetails extends Component {

    state = {}

    cancel() {
        // render confirm alert
        alert(
            'Once this action is taken, it cannot be undone',
            'Are you sure?',
            async () => {
                // render loading indicator
                this.setState({ isLoading: true });

                // update order to cancelled status
                await this.props.updateOrder(this.props.route.params._id, { status: 'cancelled' });

                // get pending orders
                await this.props.getOrders(`status=pending&start=none&end=${new Date(moment().add(1, 'year'))}`);

                // hide loading indicator
                this.setState({ isLoading: false });

                // navigate to orders
                this.props.navigation.navigate('Orders');
            },
            true
        );
    }

    render() {

        const order = this.props.route.params;
        const { isLoading } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <ScrollView>

                    {/* loading indicator start */}
                    <LoadingIndicator
                        loading={isLoading}
                    />
                    {/* loading indicator end */}

                    <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25, marginBottom: 12 }}>Order Details</Text>
                    <View style={{ padding: 12 }}>

                        {/* order details start */}
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
                                <Text>{getOrderDescription(order.type)}</Text>
                            </View>
                            {(order.status === 'pending' && order.type === 'yard assessment') && (
                                <View>
                                    <Divider />
                                    <View style={{ marginBottom: 12 }}>
                                        <Button
                                            text="Change Date"
                                            onPress={() => this.props.navigation.navigate('Change Date', { orderId: order._id })}
                                            variant="secondary"
                                        />
                                    </View>
                                    <Divider />
                                    <View>
                                        <Button
                                            text="Cancel Order"
                                            onPress={() => this.cancel()}
                                            variant="secondary"
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                        {/* order details end */}

                        {/* order images */}
                        {(order.images.length > 0) && (
                            <View style={{ marginTop: 12 }}>
                                <ImageGrid images={order.images} />
                            </View>
                        )}

                    </View>
                    {/* order details end */}

                </ScrollView>
            </SafeAreaView>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getOrders,
        updateOrder
    }, dispatch)
}

OrderDetails = connect(null, mapDispatchToProps)(OrderDetails);

export default OrderDetails;

module.exports = OrderDetails;