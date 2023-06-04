// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { debounce } from 'lodash';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
import Input from '../components/UI/Input';

// actions
import { getOrders, setSelectedOrder } from '../actions/orders/index';
import { getChangeOrders } from '../actions/changeOrders/index';
import { setFilters } from '../actions/filters/index';

// styles
import units from '../components/styles/units';
import fonts from '../components/styles/fonts';
import colors from '../components/styles/colors';

// helpers
import capitalize from '../helpers/capitalize';

// types
import types from '../vars/types';

class Orders extends Component {
  state = {
    status: 'pending',
    page: 1,
    limit: 5,
    search: '',
    region: null,
    markers: [],
    days: 1,
    fullscreenMap: false
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

  async setMapData() {

    // set order query
    let query = `status=${this.state.status}${(this.props.user.type === 'gardener') ? `&vendor=${this.props.user._id}` : ''}`;

    // if date range exists, add to query
    if (this.state.days !== 'all') {
      query += `&start=none&end=${new Date(moment().add(this.state.days, 'day').startOf('day'))}`;
    }

    // if search value exists, add to query
    if (this.state.search) query = `${query}&search=${this.state.search}`;

    // get pending orders
    const orders = await this.props.getOrders(query, true);

    let markers = [];

    // use orders to create markers
    orders.list.forEach((order) => {
      const exists = markers.find((marker) => marker.title === order.customer.address);
      if (!exists) {
        markers.push({
          latlng: { latitude: order.customer.geolocation.lat, longitude: order.customer.geolocation.lon },
          title: capitalize(`${order.customer.address}, ${order.customer.city}`),
          description: capitalize(`${order.customer.first_name} ${order.customer.last_name[0]}.`),
          streetAddress: order.customer.address
        })
      }
    })

    // set initial region
    const region = markers.length > 0 ?
      {
        latitude: markers[0].latlng.latitude,
        longitude: markers[0].latlng.longitude,
        latitudeDelta: this.state.search ? 0.01 : 0.3,
        longitudeDelta: this.state.search ? 0.01 : 0.3
      } : {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      }

    // update UI
    this.setState({
      region,
      markers
    });
  }

  async setOrders() {

    // show loading indicator
    this.setState({
      isLoading: true
    });

    // set order query
    let query = `status=${this.state.status}&page=${this.state.page}&limit=${this.state.limit}${(this.props.user.type === 'gardener') ? `&vendor=${this.props.user._id}` : ''}`;

    if (this.state.days !== 'all') {
      query += `&start=none&end=${new Date(moment().add(this.state.days, 'day').startOf('day'))}`;
    }

    // if search value exists, add to query
    if (this.state.search) query = `${query}&search=${this.state.search}`;

    // get pending orders
    await this.props.getOrders(query);

    if (this.state.status === 'pending') {

      // iterate through order list
      await this.props.orders.list.forEach(async order => {

        // get pending change orders
        await this.props.getChangeOrders(
          `order=${order._id}&status=pending approval`,
        );
      });
    }


    if (this.props.orders.list) {

      // set map data
      await this.setMapData();

      // hide loading indicator
      this.setState({ isLoading: false });
    } else {
      // hide loading indicator
      this.setState({ isLoading: false });
    }
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

  setDateFilter(days) {
    this.setState({ days }, () => {
      this.setOrders();
    });
  }

  renderMap() {
    if (this.props.orders.list) {
      return (
        <View style={{ position: 'relative', flex: 1 }}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ height: this.state.fullscreenMap ? Dimensions.get('window').height * .70 : 200, width: '100%' }}
            region={this.state.region}>
            {this.state.markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={marker.latlng}
                title={marker.title}
                description={marker.description}
              >
                <Image
                  source={{ uri: 'https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/raised-bed-01.png' }}
                  style={{ width: 32, height: 32 }}
                />
                <Callout
                  onPress={() => {
                    this.setState({ search: marker.streetAddress }, () => {
                      this.setOrders();
                    })
                  }}>
                  <View style={{ width: 150, height: '100%' }}>
                    <Text style={{ marginBottom: units.unit3, fontWeight: 'bold' }}>{marker.title}</Text>
                    <Text>{marker.description}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
          <View style={{ position: 'absolute', bottom: 16, right: 16 }}>
            <TouchableOpacity onPress={() => this.setState({ fullscreenMap: !this.state.fullscreenMap })}>
              <Ionicons
                name="expand-outline"
                size={fonts.h3}
                color={colors.purpleB}
              />
            </TouchableOpacity>
          </View>
        </View>
      )
    } else {
      return <></>;
    }
  }

  render() {
    const {
      isLoading,
      page,
      limit,
      search,
      days
    } = this.state;

    const {
      orders,
      changeOrders,
      filters,
      user
    } = this.props;

    const activeDateFilter = {
      paddingVertical: units.unit1,
      paddingHorizontal: units.unit3 + units.unit1,
      color: colors.purpleB,
      backgroundColor: colors.purpleC25,
      fontWeight: 'bold',
      borderRadius: units.unit2,
      overflow: 'hidden', // Ensures that the content is clipped within the rounded borders
    }

    const inActiveDateFilter = {
      paddingVertical: units.unit1,
      paddingHorizontal: units.unit4,
      color: colors.purpleB,
      backgroundColor: colors.white,
      fontWeight: 'bold',
    }

    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: colors.greenD5,
        }}>
        {/* loading indicator */}
        <LoadingIndicator loading={isLoading} />
        <ScrollView>

          {/* street map */}
          {this.renderMap()}

          {/* date range filter */}
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: colors.white,
            paddingVertical: units.unit3
          }}>
            <TouchableOpacity onPress={() => this.setDateFilter(1)}>
              <Text style={days === 1 ? activeDateFilter : inActiveDateFilter}>
                1D
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setDateFilter(7)}>
              <Text style={days === 7 ? activeDateFilter : inActiveDateFilter}>7D</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setDateFilter(28)}>
              <Text style={days === 28 ? activeDateFilter : inActiveDateFilter}>4W</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setDateFilter(84)}>
              <Text style={days === 84 ? activeDateFilter : inActiveDateFilter}>12W</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setDateFilter(365)}>
              <Text style={days === 365 ? activeDateFilter : inActiveDateFilter}>1Y</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setDateFilter('all')}>
              <Text style={days === 'all' ? activeDateFilter : inActiveDateFilter}>ALL</Text>
            </TouchableOpacity>
          </View>

          <View style={{ padding: units.unit3 + units.unit4 }}>
            <View>

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
