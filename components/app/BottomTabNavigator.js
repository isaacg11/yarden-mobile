import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingIndicator from '../UI/LoadingIndicator';
import Orders from '../../screens/Orders';
import Quotes from '../../screens/Quotes';
import Shop from '../../screens/Shop';
import Messages from '../../screens/Messages';
import { getQuotes } from '../../actions/quotes/index';
import { getConversations } from '../../actions/conversations/index';
import { getMessages } from '../../actions/messages/index';
import { getOrders } from '../../actions/orders/index';
import { getChangeOrders } from '../../actions/changeOrders/index';
import { getUser } from '../../actions/user/index';

const Tab = createBottomTabNavigator();

Ionicons.loadFont().then();

class BottomTabNavigator extends Component {

    state = {
        inbox: []
    }

    componentDidUpdate(prevProps) {
        if (prevProps.conversations !== this.props.conversations) {
            this.setInbox();
        }
    }

    async componentDidMount() {

        // get pending quotes
        const status = 'pending approval';
        await this.props.getQuotes(`status=${status}&page=1&limit=50`);

        // get conversations
        await this.props.getConversations(`users=${this.props.user._id}`);
    }

    async setInbox() {
        if (this.props.conversations.length > 0) {
            // iterate through conversations
            this.props.conversations.forEach(async (conversation, index) => {

                // get unread messages for conversation
                const messages = await this.props.getMessages(`conversation_id=${conversation._id}&receiver=${this.props.user._id}&opened=false`);

                // if messages, add messages to conversations
                let conversations = [];
                if (messages.length > 0) conversations.push(messages);

                // if last iteration of loop, set inbox and render UI
                if (index === this.props.conversations.length - 1) this.setState({ inbox: conversations, renderTabNavigator: true });
            })
        } else {

            // render UI
            this.setState({ renderTabNavigator: true });
        }
    }

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
            inbox,
            renderTabNavigator,
        } = this.state;

        const {
            quotes,
            filters,
            orders,
            user
        } = this.props;

        const isPendingApproval = quotes.list && quotes.list.find((quote) => quote.status === 'pending approval');

        if (renderTabNavigator) {
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
                        listeners={({ navigation }) => ({
                            tabPress: async (e) => {
                                // Prevent default action
                                e.preventDefault();

                                // set order query
                                const query = `status=${filters.orders}&page=${1}&limit=${5}`;

                                // if status is pending {...}
                                if (filters.orders === 'pending') {

                                    // get pending orders
                                    await this.props.getOrders(query);

                                    if (orders.list) {
                                        // iterate through order list
                                        await orders.list.forEach(async (order) => {

                                            // get pending change orders
                                            await this.props.getChangeOrders(`order=${order._id}&status=pending approval`);
                                        })
                                    }
                                } else {
                                    // get completed orders
                                    await this.props.getOrders(query);
                                }

                                // navigate to orders
                                navigation.jumpTo('Orders');
                            }
                        })}
                    />

                    <Tab.Screen
                        name="Quotes"
                        component={Quotes}
                        options={{ tabBarBadge: ((quotes.list && quotes.list.length > 0) && isPendingApproval) ? quotes.list.length : null, tabBarBadgeStyle: { backgroundColor: '#ff6060', color: 'white', fontWeight: 'bold' } }}
                        listeners={({ navigation }) => ({
                            tabPress: async (e) => {
                                // Prevent default action
                                e.preventDefault();

                                // set order query
                                const query = `status=${filters.quotes}&page=${1}&limit=${5}`;

                                // get completed orders
                                await this.props.getQuotes(query);

                                // navigate to quotes
                                navigation.jumpTo('Quotes');

                            }
                        })}
                    />

                    <Tab.Screen
                        name="Messages"
                        component={Messages}
                        options={{ tabBarBadge: (inbox.length > 0) ? inbox.length : null }}
                        listeners={({ navigation }) => ({
                            tabPress: async (e) => {
                                // Prevent default action
                                e.preventDefault();

                                // get conversations
                                await this.props.getConversations(`users=${user._id}`);

                                // navigate to messages
                                navigation.jumpTo('Messages');

                            }
                        })}
                    />

                    <Tab.Screen
                        name="Shop"
                        component={Shop}
                        listeners={({ navigation }) => ({
                            tabPress: async (e) => {
                                // Prevent default action
                                e.preventDefault();

                                // get user
                                await this.props.getUser(`${user._id}`);

                                // navigate to shop
                                navigation.jumpTo('Shop');

                            }
                        })}
                    />

                </Tab.Navigator>
            )
        } else {
            return (
                <LoadingIndicator
                    loading={true}
                />
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        orders: state.orders,
        user: state.user,
        quotes: state.quotes,
        conversations: state.conversations,
        filters: state.filters,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getQuotes,
        getConversations,
        getMessages,
        getOrders,
        getChangeOrders,
        getUser
    }, dispatch)
}

BottomTabNavigator = connect(mapStateToProps, mapDispatchToProps)(BottomTabNavigator);

export default BottomTabNavigator;

module.exports = BottomTabNavigator;