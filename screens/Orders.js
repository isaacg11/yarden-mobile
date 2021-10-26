
import React, { Component } from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Dropdown from '../components/UI/Dropdown';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Button from '../components/UI/Button';
import Divider from '../components/UI/Divider';
import { getOrders } from '../actions/orders/index';

class Orders extends Component {

    state = {}

    componentDidMount() {
        // set order status to pending
        this.setStatus('pending');
    }

    async setStatus(status) {
        // show loading indicator
        await this.setState({ isLoading: true, status: status });

        // get pending orders
        await this.props.getOrders(`status=${status}&start=none&end=${new Date(moment().add(1, 'year'))}`);

        // hide loading indicator
        await this.setState({ isLoading: false });
    }

    render() {

        const {
            status = 'pending',
            isLoading
        } = this.state;

        const {
            orders
        } = this.props;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                {/* loading indicator start */}
                <LoadingIndicator
                    loading={isLoading}
                />
                {/* loading indicator end */}

                <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25 }}>Orders</Text>
                <View style={{ padding: 12 }}>

                    {/* status start */}
                    <Dropdown
                        value={status}
                        onChange={(value) => this.setStatus(value)}
                        options={[
                            {
                                label: 'Pending',
                                value: 'pending'
                            },
                            {
                                label: 'Complete',
                                value: 'complete'
                            }
                        ]}
                        placeholder="Status"
                    />
                    {/* status end */}

                    {/* orders start */}
                    {orders.list && orders.list.map((order, index) => (
                        <View key={index} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
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
                    {(orders.list && orders.list.length < 1) && (
                        <View style={{ marginBottom: 12 }}>
                            <Text style={{ fontWeight: 'bold', marginTop: 12, textAlign: 'center' }}>No orders found</Text>
                        </View>
                    )}
                    {/* orders end */}
                </View>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        orders: state.orders
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getOrders
    }, dispatch)
}

Orders = connect(mapStateToProps, mapDispatchToProps)(Orders);

export default Orders;

module.exports = Orders;