import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Dropdown from '../components/UI/Dropdown';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Paragraph from '../components/UI/Paragraph';
import Button from '../components/UI/Button';
import Divider from '../components/UI/Divider';
import Notification from '../components/UI/Notification';
import Paginate from '../components/UI/Paginate';
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import { getOrders } from '../actions/orders/index';
import { getChangeOrders } from '../actions/changeOrders/index';
import { setFilters } from '../actions/filters/index';
import units from '../components/styles/units';

class Orders extends Component {
  state = {
    status: 'pending',
    page: 1,
    limit: 5,
  };

  componentDidMount() {
    this.setStatus('pending');
  }

  async setStatus(status) {
    // show loading indicator and set status
    this.setState({
      isLoading: true,
      status: status,
    });

    // set new status
    await this.props.setFilters({ orders: status });

    // set order query
    const query = `status=${status}&page=${this.state.page}&limit=${this.state.limit}`;

    // if status is pending {...}
    if (status === 'pending') {
      // get pending orders
      await this.props.getOrders(query);

      // iterate through order list
      await this.props.orders.list.forEach(async order => {
        // get pending change orders
        await this.props.getChangeOrders(
          `order=${order._id}&status=pending approval`,
        );
      });
    } else {
      // get completed orders
      await this.props.getOrders(query);
    }

    // show loading indicator
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

  render() {
    const { isLoading, page, limit } = this.state;

    const { orders, changeOrders, filters } = this.props;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
        }}>
        <ScrollView>
          {/* loading indicator start */}
          <LoadingIndicator loading={isLoading} />


          <View style={{ padding: units.unit5 }}>
            <Header
              type="h4"
              style={{
                marginBottom: units.unit5,
              }}>
              Orders {orders.total && orders.total > 0 ? `(${orders.total})` : ''}
            </Header>

            {/* status filter */}
            <Dropdown
              label="Filter"
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
            />

            {/* order list */}
            {orders.list &&
              orders.list.map((order, index) => (
                <Card key={index} style={{ marginTop: units.unit4 }}>
                  {/* change order notification */}
                  {changeOrders.length > 0 &&
                    changeOrders.find(c => c.order._id === order._id) && (
                      <View>
                        <Notification text="Your contractor has sent you a change order. Tap the button below to review and approve." />
                        <Button
                          text="Review Change"
                          onPress={() =>
                            this.props.navigation.navigate(
                              'Change Order Details',
                              changeOrders.find(c => c.order._id === order._id),
                            )
                          }
                          variant="primary"
                        />
                      </View>
                    )}

                  {/* order info */}
                  <View style={{ marginBottom: units.unit5 }}>
                    <Paragraph
                      style={{ fontWeight: 'bold', marginTop: units.unit5 }}>
                      Service
                    </Paragraph>
                    <Paragraph>{order.type}</Paragraph>
                    <Paragraph
                      style={{ fontWeight: 'bold', marginTop: units.unit5 }}>
                      Date
                    </Paragraph>
                    <Paragraph>
                      {moment(order.date).format('MM/DD/YYYY')}{' '}
                      {order.time
                        ? `@ ${moment(order.time, `HH:mm:ss`).format(`h:mm A`)}`
                        : ''}
                    </Paragraph>
                  </View>
                  <View>
                    <Button
                      text="View Details"
                      onPress={() =>
                        this.props.navigation.navigate('Order Details', order)
                      }
                      variant="btn2"
                      small
                    />
                  </View>
                </Card>
              ))}

            {/* pagination */}
            {orders.list && orders.total > limit && (
              <View style={{ marginBottom: units.unit5 }}>
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
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
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
    },
    dispatch,
  );
}

Orders = connect(mapStateToProps, mapDispatchToProps)(Orders);

export default Orders;

module.exports = Orders;
