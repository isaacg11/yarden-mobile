import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Orders from '../../screens/Orders';
import Quotes from '../../screens/Quotes';
import Shop from '../../screens/Shop';
import Messenger from '../../screens/Messenger';
import { getOrders } from '../../actions/orders/index';
import { getChangeOrders } from '../../actions/changeOrders/index';

const Tab = createBottomTabNavigator();

Ionicons.loadFont().then();

class BottomTabNavigator extends Component {

    renderIcon(route) {
        switch (route) {
            case 'Orders':
                return <Ionicons name={'reader-outline'} size={30} />
            case 'Quotes':
                return <Ionicons name={'layers-outline'} size={30} />
            case 'Shop':
                return <Ionicons name={'cart-outline'} size={30} />
            case 'Messages':
                return <Ionicons name={'file-tray-outline'} size={30} />
            default:
                return <Ionicons name={'ios-information-circle'} size={30} />
        }
    }

    render() {

        const {
            quotes
        } = this.props;

        const isPendingApproval = quotes.list && quotes.list.find((quote) => quote.status === 'pending approval');

        return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        const icon = this.renderIcon(route.name);
                        return icon;
                    },
                    headerShown: false
                })}
            >
                <Tab.Screen
                    name="Orders"
                    component={Orders}
                />

                <Tab.Screen
                    name="Quotes"
                    component={Quotes}
                    options={{ tabBarBadge: ((quotes.list && quotes.list.length > 0) && isPendingApproval) ? quotes.list.length : null }}
                />

                <Tab.Screen
                    name="Messages"
                    component={Messenger}
                />

                <Tab.Screen
                    name="Shop"
                    component={Shop}
                />

            </Tab.Navigator>
        )
    }
}

function mapStateToProps(state) {
    return {
        orders: state.orders,
        user: state.user,
        quotes: state.quotes
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getOrders,
        getChangeOrders
    }, dispatch)
}

BottomTabNavigator = connect(mapStateToProps, mapDispatchToProps)(BottomTabNavigator);

export default BottomTabNavigator;

module.exports = BottomTabNavigator;