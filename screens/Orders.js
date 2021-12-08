
import React, { Component } from 'react';
import { Text, SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Dropdown from '../components/UI/Dropdown';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Button from '../components/UI/Button';
import Divider from '../components/UI/Divider';
import Notification from '../components/UI/Notification';
import { getOrders } from '../actions/orders/index';
import { getChangeOrders } from '../actions/changeOrders/index';

class Orders extends Component {

    state = {
        status: 'pending'
    }

    componentDidMount() {
        // set order status to pending
        this.setStatus('pending');
    }

    async setStatus(status) {

        // set new status
        this.setState({ status: status });

        // if status is pending {...}
        if (status === 'pending') {

            // get pending orders
            await this.props.getOrders(`status=${status}&start=none&end=${new Date(moment().add(1, 'year'))}`);

            // iterate through order list
            await this.props.orders.list.forEach(async (order) => {

                // get pending change orders
                await this.props.getChangeOrders(`order=${order._id}&status=pending approval`);
            })

        } else {
            // get completed orders
            await this.props.getOrders(`status=${status}`);
        }
    }

    render() {

        const {
            status,
            isLoading
        } = this.state;

        const {
            orders,
            changeOrders
        } = this.props;

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

                    <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25 }}>Orders {(orders.list && orders.list.length > 0) ? `(${orders.list.length})` : ''}</Text>
                    <View style={{ padding: 12 }}>

                        {/* status filter */}
                        <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5, marginBottom: 12 }}>
                            <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Filter</Text>
                            <Dropdown
                                value={status}
                                onChange={(value) => this.setStatus(value)}
                                options={[
                                    {
                                        label: 'Pending',
                                        value: 'pending',
                                    },
                                    {
                                        label: 'Complete',
                                        value: 'complete',
                                    }
                                ]}
                            />
                        </View>

                        {/* order list */}
                        {orders.list && orders.list.map((order, index) => (
                            <View key={index} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5, marginBottom: 12 }}>

                                {/* change order notification */}
                                {((changeOrders.length > 0) && (changeOrders.find((c) => c.order._id === order._id))) && (
                                    <View>
                                        <Notification
                                            text="Your contractor has sent you a change order. Tap the button below to review and approve."
                                        />
                                        <Button
                                            text="Review Change"
                                            onPress={() => this.props.navigation.navigate('Change Order Details', changeOrders.find((c) => c.order._id === order._id))}
                                            variant="primary"
                                        />
                                    </View>
                                )}

                                {/* order info */}
                                <View style={{ marginBottom: 12 }}>
                                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Service</Text>
                                    <Text>{order.type}</Text>
                                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Date</Text>
                                    <Text>{moment(order.date).format('MM/DD/YYYY')} {(order.time) ? `@ ${moment(order.time, `HH:mm:ss`).format(`h:mm A`)}` : ''}</Text>
                                </View>
                                <Divider />
                                <View>
                                    <Button
                                        text="View Details"
                                        onPress={() => this.props.navigation.navigate('Order Details', order)}
                                        variant="secondary"
                                    />
                                </View>
                            </View>
                        ))}

                        {/* no orders */}
                        {(orders.list && orders.list.length < 1) && (
                            <View style={{ marginBottom: 12 }}>
                                <Text style={{ fontWeight: 'bold', marginTop: 12, textAlign: 'center' }}>No orders found</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        orders: state.orders,
        changeOrders: state.changeOrders
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getOrders,
        getChangeOrders
    }, dispatch)
}

Orders = connect(mapStateToProps, mapDispatchToProps)(Orders);

export default Orders;

module.exports = Orders;