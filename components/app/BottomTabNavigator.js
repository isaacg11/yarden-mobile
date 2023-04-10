// libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Orders from '../../screens/Orders';
import Quotes from '../../screens/Quotes';
// import Shop from '../../screens/Shop';
import Messages from '../../screens/Messages';
import Reminders from '../../screens/Reminders';
import Reports from '../../screens/Reports';

// actions
import { getQuotes } from '../../actions/quotes/index';
import { getConversations } from '../../actions/conversations/index';
import { getMessages } from '../../actions/messages/index';
import { getOrders } from '../../actions/orders/index';
import { getChangeOrders } from '../../actions/changeOrders/index';
import { getUser } from '../../actions/user/index';
import { getReminders } from '../../actions/reminders/index';

// types
import types from '../../vars/types';

// style
import fonts from '../styles/fonts';
import colors from '../styles/colors';
import units from '../styles/units';

const Tab = createBottomTabNavigator();
Ionicons.loadFont().then();

class BottomTabNavigator extends Component {
  state = {
    inbox: [],
  };

  componentDidUpdate(prevProps) {
    if (prevProps.conversations !== this.props.conversations) {
      this.setInbox();
    }
  }

  async componentDidMount() {

    if (this.props.user.type === types.CUSTOMER) {
      const status = 'pending approval';

      // get pending quotes
      await this.props.getQuotes(`status=${status}&page=1&limit=50`);
    } else if (this.props.user.type === types.GARDENER) {

      // get pending reminders
      await this.props.getReminders(`status=pending&page=1&limit=50`);
    }

    // get conversations
    await this.props.getConversations(`users=${this.props.user._id}`);
  }

  async setInbox() {
    if (this.props.conversations.length > 0) {
      // iterate through conversations
      this.props.conversations.forEach(async (conversation, index) => {
        // get unread messages for conversation
        const messages = await this.props.getMessages(
          `conversation_id=${conversation._id}&receiver=${this.props.user._id}&opened=false`,
        );

        // if messages, add messages to conversations
        let conversations = [];
        if (messages.length > 0) conversations.push(messages);

        // if last iteration of loop, set inbox and render UI
        if (index === this.props.conversations.length - 1)
          this.setState({ inbox: conversations, renderTabNavigator: true });
      });
    } else {
      // render UI
      this.setState({ renderTabNavigator: true });
    }
  }

  renderIcon(route, focused) {
    switch (route) {
      case 'Dashboard':
        return (
          <Ionicons name={focused ? 'home' : 'home-outline'} color={'white'} size={fonts.h2} />
        );
      case 'Orders':
        return (
          <Ionicons name={focused ? 'reader' : 'reader-outline'} color={'white'} size={fonts.h2} />
        );
      case 'Quotes':
        return (
          <Ionicons name={focused ? 'layers' : 'layers-outline'} color={'white'} size={fonts.h2} />
        );
      case 'Reminders':
        return (
          <Ionicons name={focused ? 'calendar' : 'calendar-outline'} color={'white'} size={fonts.h2} />
        );
      case 'Shop':
        return (
          <Ionicons name={focused ? 'cart' : 'cart-outline'} color={'white'} size={fonts.h2} />
        );
      case 'Messages':
        return (
          <Ionicons
            name={focused ? 'file-tray' : 'file-tray-outline'}
            color={'white'}
            size={fonts.h2}
          />
        );
      default:
        return (
          <Ionicons
            name={'ios-information-circle'}
            color={'white'}
            size={fonts.h2}
          />
        );
    }
  }

  render() {
    const { inbox, renderTabNavigator } = this.state;

    const {
      quotes,
      filters,
      orders,
      user,
      reminders,
      pagination
    } = this.props;

    const isPendingApproval =
      quotes.list &&
      quotes.list.find(quote => quote.status === 'pending approval');

    // if tab nav ready to render {...}
    if (renderTabNavigator) {

      // if user type is customer {...}
      if (user.type === 'customer') {

        // render customer UI
        return (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                const icon = this.renderIcon(route.name, focused);
                return icon;
              },
              headerShown: false,
              tabBarActiveTintColor: colors.green0,
              tabBarInactiveTintColor: 'white',
              tabBarActiveBackgroundColor: colors.purpleD,
              tabBarInactiveBackgroundColor: colors.purpleD,
              tabBarLabelStyle: {
                fontFamily: fonts.default,
              },
              tabBarStyle: {
                backgroundColor: colors.purpleD,
                paddingVertical: units.unit4,
                height: units.unit6 + units.unit5,
              },
            })}>

            <Tab.Screen
              name="Dashboard"
              component={Reports}
              listeners={({ navigation }) => ({
                tabPress: async e => {
                  // do stuff
                },
              })}
            />

            <Tab.Screen
              name="Orders"
              component={Orders}
              listeners={({ navigation }) => ({
                tabPress: async e => {
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
                      await orders.list.forEach(async order => {
                        // get pending change orders
                        await this.props.getChangeOrders(
                          `order=${order._id}&status=pending approval`,
                        );
                      });
                    }
                  } else {
                    // get completed orders
                    await this.props.getOrders(query);
                  }

                  // navigate to orders
                  navigation.jumpTo('Orders');
                },
              })}
            />

            <Tab.Screen
              name="Quotes"
              component={Quotes}
              options={{
                tabBarBadge:
                  quotes.list && quotes.list.length > 0 && isPendingApproval
                    ? quotes.list.length
                    : null,
                tabBarBadgeStyle: {
                  backgroundColor: '#ff6060',
                  color: 'white',
                  fontWeight: 'bold',
                },
              }}
              listeners={({ navigation }) => ({
                tabPress: async e => {
                  // Prevent default action
                  e.preventDefault();

                  // set order query
                  const query = `status=${filters.quotes}&page=${1}&limit=${5}`;

                  // get completed orders
                  await this.props.getQuotes(query);

                  // navigate to quotes
                  navigation.jumpTo('Quotes');
                },
              })}
            />

            <Tab.Screen
              name="Messages"
              component={Messages}
              options={{
                tabBarBadge: inbox.length > 0 ? inbox.length : null,
                tabBarBadgeStyle: {
                  backgroundColor: '#ff6060',
                  color: 'white',
                  fontWeight: 'bold',
                },
              }}
              listeners={({ navigation }) => ({
                tabPress: async e => {
                  // Prevent default action
                  e.preventDefault();

                  // get conversations
                  await this.props.getConversations(`users=${user._id}`);

                  // navigate to messages
                  navigation.jumpTo('Messages');
                },
              })}
            />

            {/* NOTE: temporarily removing shop until e-commerce is possible
            Author: Isaac G. 2/28/23 */}
            {/* <Tab.Screen
              name="Shop"
              component={Shop}
              listeners={({ navigation }) => ({
                tabPress: async e => {
                  // Prevent default action
                  e.preventDefault();

                  // get user
                  await this.props.getUser(`${user._id}`);

                  // navigate to shop
                  navigation.jumpTo('Shop');
                },
              })}
            /> */}
          </Tab.Navigator>
        );
      }

      // if user is a gardener {...}
      if (user.type === 'gardener') {

        // render gardener UI
        return (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                const icon = this.renderIcon(route.name, focused);
                return icon;
              },
              headerShown: false,
              tabBarActiveTintColor: colors.green0,
              tabBarInactiveTintColor: 'white',
              tabBarActiveBackgroundColor: colors.purpleD,
              tabBarInactiveBackgroundColor: colors.purpleD,
              tabBarLabelStyle: {
                fontFamily: fonts.default,
              },
              tabBarStyle: {
                backgroundColor: colors.purpleD,
                paddingVertical: units.unit4,
                height: units.unit6 + units.unit5,
              },
            })}>
            <Tab.Screen
              name="Orders"
              component={Orders}
              listeners={({ navigation }) => ({
                tabPress: async e => {
                  // Prevent default action
                  e.preventDefault();

                  // set order query
                  const query = `status=${filters.orders}&page=${1}&limit=${5}&vendor=${user._id}`;

                  // if status is pending {...}
                  if (filters.orders === 'pending') {
                    // get pending orders
                    await this.props.getOrders(query);

                    if (orders.list) {
                      // iterate through order list
                      await orders.list.forEach(async order => {
                        // get pending change orders
                        await this.props.getChangeOrders(
                          `order=${order._id}&status=pending approval`,
                        );
                      });
                    }
                  } else {
                    // get completed orders
                    await this.props.getOrders(query);
                  }

                  // navigate to orders
                  navigation.jumpTo('Orders');
                },
              })}
            />

            <Tab.Screen
              name="Reminders"
              component={Reminders}
              options={{
                tabBarBadge:
                  reminders.list && reminders.list.length > 0
                    ? reminders.total
                    : null,
                tabBarBadgeStyle: {
                  backgroundColor: '#ff6060',
                  color: 'white',
                  fontWeight: 'bold',
                },
              }}
              listeners={({ navigation }) => ({
                tabPress: async e => {
                  // Prevent default action
                  e.preventDefault();

                  // set order query
                  const query = `status=${filters.reminders}&page=${pagination.reminders}&limit=${5}`;

                  // get reminders
                  await this.props.getReminders(query);

                  // navigate to quotes
                  navigation.jumpTo('Reminders');
                },
              })}
            />

            <Tab.Screen
              name="Messages"
              component={Messages}
              options={{
                tabBarBadge: inbox.length > 0 ? inbox.length : null,
                tabBarBadgeStyle: {
                  backgroundColor: '#ff6060',
                  color: 'white',
                  fontWeight: 'bold',
                },
              }}
              listeners={({ navigation }) => ({
                tabPress: async e => {
                  // Prevent default action
                  e.preventDefault();

                  // get conversations
                  await this.props.getConversations(`users=${user._id}`);

                  // navigate to messages
                  navigation.jumpTo('Messages');
                },
              })}
            />

          </Tab.Navigator>
        );
      }

    } else {
      // return <LoadingIndicator loading={!renderTabNavigator} />;
    }

    return null;
  }
}

function mapStateToProps(state) {
  return {
    orders: state.orders,
    user: state.user,
    quotes: state.quotes,
    conversations: state.conversations,
    filters: state.filters,
    reminders: state.reminders,
    pagination: state.pagination
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getQuotes,
      getConversations,
      getMessages,
      getOrders,
      getChangeOrders,
      getUser,
      getReminders
    },
    dispatch,
  );
}

BottomTabNavigator = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BottomTabNavigator);

export default BottomTabNavigator;

module.exports = BottomTabNavigator;