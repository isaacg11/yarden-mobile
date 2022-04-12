
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { alert } from '../components/UI/SystemAlert';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Collapse from '../components/UI/Collapse';
import Button from '../components/UI/Button';
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import ImageGrid from '../components/app/ImageGrid';
import OrderInfo from '../components/app/OrderInfo';
import ChangeOrders from '../components/app/ChangeOrders';
import { getOrders, updateOrder } from '../actions/orders/index';
import { getChangeOrders } from '../actions/changeOrders/index';
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class OrderDetails extends Component {

    state = {
        changeOrders: []
    }

    async componentDidMount() {
        // show loading indicator
        this.setState({ isLoading: true });

        // get change orders
        const changeOrders = await this.props.getChangeOrders(`order=${this.props.route.params._id}`, true);

        // hide loading indicator
        this.setState({
            isLoading: false,
            changeOrders: changeOrders
        });
    }

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

    requestChanges() {
        // navigate to request change page
        this.props.navigation.navigate('Request Order Change', this.props.route.params);
    }

    render() {

        const order = this.props.route.params;
        const { isLoading, changeOrders } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <ScrollView>
                    <View style={{ padding: units.unit3 + units.unit4 }}>
                        {/* loading indicator */}
                        <LoadingIndicator
                            loading={isLoading}
                        />

                        <Header type="h4" style={{ marginBottom: units.unit5 }}>
                            Order Details
                        </Header>
                        <View>

                            {/* order info */}
                            <Card>
                                <OrderInfo
                                    order={order}
                                    onChangeDate={() => this.props.navigation.navigate('Change Date', { orderId: order._id })}
                                    onCancel={() => this.cancel()}
                                />
                            </Card>

                            {/* change orders */}
                            {(changeOrders.length > 0) && (
                                <View>
                                    <Collapse
                                        title={`Change Orders (${changeOrders.length})`}
                                        open={changeOrders.find((changeOrder) => changeOrder.status === 'pending approval')}
                                        content={
                                            <ChangeOrders
                                                changeOrders={changeOrders}
                                                onPress={(changeOrder) => this.props.navigation.navigate('Change Order Details', changeOrder)}
                                            />
                                        }
                                    />
                                </View>
                            )}

                            {/* order images */}
                            {(order.images.length > 0) && (
                                <View>
                                    <ImageGrid images={order.images} />
                                </View>
                            )}

                            {/* navigation button */}
                            {(order.type === 'installation' || order.type === 'revive' || order.type === 'misc') && (
                                <View style={{marginTop: units.unit4}}>
                                    <Button
                                        text="Request Changes"
                                        onPress={() => this.requestChanges()}
                                        icon={(
                                            <Ionicons
                                                name="create-outline"
                                                size={units.unit4}
                                                color={colors.purpleB}
                                            />
                                        )}
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getOrders,
        updateOrder,
        getChangeOrders
    }, dispatch)
}

OrderDetails = connect(null, mapDispatchToProps)(OrderDetails);

export default OrderDetails;

module.exports = OrderDetails;