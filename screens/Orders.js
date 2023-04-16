// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { debounce } from 'lodash';

// UI components
import Dropdown from '../components/UI/Dropdown';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Paragraph from '../components/UI/Paragraph';
import Label from '../components/UI/Label';
import Button from '../components/UI/Button';
import Link from '../components/UI/Link';
import Divider from '../components/UI/Divider';
import Notification from '../components/UI/Notification';
import Paginate from '../components/UI/Paginate';
import Header from '../components/UI/Header';
import Input from '../components/UI/Input';

// actions
import { setSelectedOrder } from '../actions/orders/index';
import { getOrders } from '../actions/orders/index';
import { getChangeOrders } from '../actions/changeOrders/index';
import { setFilters } from '../actions/filters/index';

// styles
import units from '../components/styles/units';
import fonts from '../components/styles/fonts';
import colors from '../components/styles/colors';

// types
import types from '../vars/types';

class Orders extends Component {
  state = {
    status: 'pending',
    page: 1,
    limit: 5,
    search: ''
  };

  componentDidMount() {
    this.setStatus('pending');
  }

  async setStatus(status) {

    // set status
    this.setState({ status });

    // set new status
    await this.props.setFilters({ orders: status });

    // set orders
    await this.setOrders();
  }

  async setOrders() {
    // show loading indicator
    this.setState({
      isLoading: true
    });

    // set order query
    let query = `status=${this.state.status}&page=${this.state.page}&limit=${this.state.limit}${(this.props.user.type === 'gardener') ? `&vendor=${this.props.user._id}` : ''}`;

    // if search value exists, add to query
    if(this.state.search) query = `${query}&search=${this.state.search}`;

    // get pending orders
    await this.props.getOrders(query);

    // if status is pending {...}
    if (this.state.status === 'pending') {
      // iterate through order list
      await this.props.orders.list.forEach(async order => {
        // get pending change orders
        await this.props.getChangeOrders(
          `order=${order._id}&status=pending approval`,
        );
      });
    }

    // hide loading indicator
    this.setState({ isLoading: false });
  }

  paginate(direction) {
    // show loading indicator
    this.setState({ isLoading: true });

    // set intitial page
    let page = 1;

    // if direction is forward, increase page by 1
    if (direction === 'forward') page = this.state.page + 1;

    // if direction is back, decrease page by 1
    if (direction === 'back') page = this.state.page - 1;

    // set new page
    this.setState({ page: page }, async () => {
      // set status
      await this.setStatus(this.state.status);

      // hide loading indicator
      this.setState({ isLoading: false });
    });
  }

  searchOrders = debounce(() => {
    this.setOrders();
  }, 1000);

  render() {
    const {
      isLoading,
      page,
      limit,
      search
    } = this.state;

    const {
      orders,
      changeOrders,
      filters,
      user
    } = this.props;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: colors.greenD5,
        }}>
        <ScrollView>
          <View style={{ padding: units.unit3 + units.unit4 }}>

            {/* loading indicator */}
            <LoadingIndicator loading={isLoading} />

            <View>
              <Header
                type="h4"
                style={{
                  marginBottom: units.unit5,
                }}>
                Orders{' '}
                {orders.total && orders.total > 0 ? `(${orders.total})` : ''}
              </Header>

              {/* status filter */}
              <Dropdown
                label="Status"
                value={filters.orders}
                onChange={value => this.setStatus(value)}
                options={[
                  {
                    label: 'Pending',
                    value: 'pending',
                  },
                  {
                    label: 'Complete',
                    value: 'complete',
                  },
                ]}
                style={{ marginBottom: units.unit4 }}
              />

              {/* search input */}
              {(user.type === types.GARDENER) && (
                <Input
                  label="Search"
                  placeholder="Search Orders"
                  value={search}
                  onChange={(value) => {
                    this.setState({ search: value }, () => {
                      this.searchOrders();
                    })
                  }}
                />
              )}

              {/* order list */}
              {orders.list &&
                orders.list.map((order, index) => (
                  <View key={index}>
                    {/* change order notification */}
                    {changeOrders.length > 0 &&
                      changeOrders.find(c => c.order._id === order._id) && (
                        <View>
                          <Notification text="You have been sent a change order. Tap the button below to review and approve." />
                          <Button
                            style={{ marginTop: units.unit3 }}
                            text="Review Change Order"
                            onPress={() =>
                              this.props.navigation.navigate(
                                'Change Order Details',
                                changeOrders.find(
                                  c => c.order._id === order._id,
                                ),
                              )
                            }
                            variant="primary"
                          />
                        </View>
                      )}
                    <View
                      style={{
                        marginVertical: units.unit4 + units.unit3,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>

                      {/* order info */}
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginHorizontal: units.unit4,
                          }}>
                          <Label>{moment(order.date).format('ddd')} </Label>
                          <Paragraph style={{ color: colors.greenD50 }}>
                            {moment(order.date).format('MM/DD')}{' '}
                          </Paragraph>
                        </View>
                        <View>
                          {user.type === types.GARDENER && (
                            <Text>{order.customer.address}</Text>
                          )}
                          <Text
                            style={{
                              fontSize: fonts.h3,
                              textTransform: 'capitalize',
                              color: colors.greenE75,
                              fontWeight: 'bold',
                            }}>
                            {order.type}
                          </Text>
                          <Label>
                            {order.time
                              ? `${moment(order.time, `HH:mm:ss`).format(
                                `h:mm A`,
                              )}`
                              : '9:00am - 5:00pm'}
                          </Label>
                        </View>
                      </View>
                      <View>
                        <Link
                          text="View Details"
                          onPress={() => {

                            // set selected order
                            this.props.setSelectedOrder(order);

                            // redirect user to order details
                            this.props.navigation.navigate(
                              'Order Details',
                              order,
                            )
                          }
                          }
                        />
                      </View>
                    </View>
                    <Divider />
                  </View>
                ))}

              {/* pagination */}
              {orders.list && orders.total > limit && (
                <View
                  style={{ marginTop: units.unit6, marginBottom: units.unit4 }}>
                  <Paginate
                    page={page}
                    limit={limit}
                    total={orders.total}
                    onPaginate={direction => this.paginate(direction)}
                  />
                </View>
              )}

              {/* no orders */}
              {orders.list && orders.list.length < 1 && (
                <View style={{ marginBottom: units.unit5 }}>
                  <Paragraph
                    style={{
                      fontWeight: 'bold',
                      marginTop: units.unit5,
                      textAlign: 'center',
                    }}>
                    No orders found
                  </Paragraph>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    orders: state.orders,
    changeOrders: state.changeOrders,
    filters: state.filters,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOrders,
      getChangeOrders,
      setFilters,
      setSelectedOrder
    },
    dispatch,
  );
}

Orders = connect(mapStateToProps, mapDispatchToProps)(Orders);

export default Orders;

module.exports = Orders;
