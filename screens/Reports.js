// libraries
import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

// UI components
import HarvestReport from '../components/app/HarvestReport';
import BedList from '../components/app/BedList';
import Header from '../components/UI/Header';
import Paragraph from '../components/UI/Paragraph';
import CircularButton from '../components/UI/CircularButton';
import Label from '../components/UI/Label';
import Link from '../components/UI/Link';
import Divider from '../components/UI/Divider';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Button from '../components/UI/Button';

// actions
import {getBeds} from '../actions/beds/index';
import {getOrders, setSelectedOrder} from '../actions/orders/index';
import {getPlantActivities} from '../actions/plantActivities/index';
import {getPlantList} from '../actions/plantList';
import {getPlantSelection} from '../actions/plantSelections';

// helpers
import {APP_URL} from '../helpers/getUrl';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';

// types
import types from '../vars/types';

class Reports extends Component {
  state = {
    pendingOrders: [],
    completedOrders: [],
    dateFilter: 1,
    isLoading: true,
  };

  async componentDidMount() {
    // get beds
    this.props.getBeds(`customer=${this.props.user._id}`);

    // get pending orders
    const pendingOrders = await this.props.getOrders(
      `customer=${this.props.user._id}&status=${types.PENDING}`,
      true,
    );

    // get completed orders
    const completedOrders = await this.props.getOrders(
      `customer=${this.props.user._id}&status=${
        types.COMPLETE
      }&start=${new Date(moment().startOf('month'))}&end=${new Date(
        moment().endOf('month'),
      )}`,
      true,
    );

    // NOTE: This check is necessary until after the Spring 2024 crop rotations, where all legacy customers will be converted into a permanent plant list
    // Author: Isaac G. - 2/29/24
    let requiredToBuildPlantSelection = false;
    const plantSelection = await this.props.getPlantSelection(
      this.props.user._id,
    );
    if (!plantSelection) {
      const cropRotation = pendingOrders.list.find(
        pendingOrder => pendingOrder.type === types.CROP_ROTATION,
      );
      if (cropRotation) {
        requiredToBuildPlantSelection = true;
      }
    }

    // update UI
    this.setState({
      pendingOrders,
      completedOrders,
      requiredToBuildPlantSelection,
      isLoading: false,
    });
  }

  setDateFilter(dateFilter) {
    this.setState({dateFilter, isLoading: true}, async () => {
      let completedOrders = [];
      if (dateFilter === 1) {
        completedOrders = await this.props.getOrders(
          `customer=${this.props.user._id}&status=${
            types.COMPLETE
          }&start=${new Date(moment().startOf('month'))}&end=${new Date(
            moment().endOf('month'),
          )}`,
          true,
        );
      } else if (dateFilter === 2) {
        completedOrders = await this.props.getOrders(
          `customer=${this.props.user._id}&status=${
            types.COMPLETE
          }&start=${new Date(
            moment().subtract(1, 'month').startOf('month'),
          )}&end=${new Date(moment().subtract(1, 'month').endOf('month'))}`,
          true,
        );
      } else if (dateFilter === 3) {
        completedOrders = await this.props.getOrders(
          `customer=${this.props.user._id}&status=${
            types.COMPLETE
          }&start=${new Date(
            moment().subtract(2, 'month').startOf('month'),
          )}&end=${new Date(moment().subtract(2, 'month').endOf('month'))}`,
          true,
        );
      } else if (dateFilter === 4) {
        completedOrders = await this.props.getOrders(
          `customer=${this.props.user._id}&status=${
            types.COMPLETE
          }&start=${new Date(
            moment().subtract(3, 'month').startOf('month'),
          )}&end=${new Date(moment().subtract(3, 'month').endOf('month'))}`,
          true,
        );
      } else if (dateFilter === 5) {
        completedOrders = await this.props.getOrders(
          `customer=${this.props.user._id}&status=${types.COMPLETE}`,
          true,
        );
      }

      this.setState({
        completedOrders,
        isLoading: false,
      });
    });
  }

  renderRequiredToBuildPlantSelectionMessage() {
    return (
      <View
        style={{
          paddingVertical: units.unit5,
          paddingHorizontal: units.unit4,
          backgroundColor: '#ffff66',
        }}>
        <Text style={{marginBottom: units.unit4}}>
          Starting Spring 2024, you will be asked to build a permanent plant
          list for the warm and cold seasons. This way, you will no longer be
          required to manually select your garden plants during every season
          change like you did in the past.
        </Text>
        <Button
          variant="btn3"
          text="Select Plants"
          alignIconRight={true}
          icon={
            <Ionicons
              name={'arrow-forward'}
              color={colors.purpleB}
              size={fonts.h3}
            />
          }
          onPress={() => {
            Linking.openURL(`${APP_URL}/plant-selection`);
          }}
        />
      </View>
    );
  }

  renderOrder(order) {
    const {user} = this.props;
    return (
      <View>
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
              <Paragraph style={{color: colors.greenD50}}>
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
                  ? `${moment(order.time, `HH:mm:ss`).format(`h:mm A`)}`
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
                this.props.navigation.navigate('Order Details', order);
              }}
            />
          </View>
        </View>
        <Divider />
      </View>
    );
  }

  render() {
    const {
      pendingOrders,
      completedOrders,
      dateFilter,
      isLoading,
      requiredToBuildPlantSelection,
    } = this.state;

    const activeDateFilter = {
      paddingVertical: units.unit1,
      paddingHorizontal: units.unit3 + units.unit1,
      color: colors.purpleB,
      backgroundColor: colors.purpleC25,
      borderRadius: units.unit2,
      overflow: 'hidden', // Ensures that the content is clipped within the rounded borders
    };

    const inActiveDateFilter = {
      paddingVertical: units.unit1,
      paddingHorizontal: units.unit4,
      color: colors.purpleB,
    };

    if (isLoading) {
      return <LoadingIndicator loading={true} />;
    } else {
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
            {requiredToBuildPlantSelection &&
              this.renderRequiredToBuildPlantSelectionMessage()}

            {/* harvest report */}
            <HarvestReport
              onCheckStatus={() => this.props.navigation.navigate('Orders')}
            />

            {/* bed list */}
            <View style={{padding: units.unit4}}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: units.unit4,
                }}>
                <Header type="h5" style={{color: colors.purpleC75}}>
                  Garden Beds
                </Header>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Paragraph
                    style={{color: colors.purpleB, marginRight: units.unit3}}>
                    Add
                  </Paragraph>
                  <CircularButton
                    small
                    icon={
                      <Ionicons
                        name={'add-outline'}
                        color={colors.purpleB}
                        size={fonts.h3}
                      />
                    }
                    onPress={() => this.props.navigation.navigate('New Beds')}
                  />
                </View>
              </View>
              <BedList
                onSelect={bed => this.props.navigation.navigate('Bed', bed)}
              />
            </View>

            {/* pending orders */}
            <View style={{padding: units.unit4}}>
              <View
                style={{
                  marginBottom: units.unit4,
                }}>
                <Header type="h5" style={{color: colors.greenE50}}>
                  Pending Orders
                </Header>
                {pendingOrders?.list?.map((order, index) => (
                  <View key={index}>{this.renderOrder(order)}</View>
                ))}
                {pendingOrders?.list?.length < 1 && (
                  <View style={{padding: units.unit5}}>
                    <Text style={{textAlign: 'center'}}>No results found</Text>
                  </View>
                )}
              </View>
            </View>

            {/* completed orders */}
            <View style={{padding: units.unit4}}>
              <View
                style={{
                  marginBottom: units.unit4,
                }}>
                <Header
                  type="h5"
                  style={{color: colors.greenE50, marginBottom: units.unit3}}>
                  Completed Orders
                </Header>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    paddingVertical: units.unit3,
                  }}>
                  <TouchableOpacity onPress={() => this.setDateFilter(1)}>
                    <Text
                      style={
                        dateFilter === 1 ? activeDateFilter : inActiveDateFilter
                      }>
                      This Month
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setDateFilter(2)}>
                    <Text
                      style={
                        dateFilter === 2 ? activeDateFilter : inActiveDateFilter
                      }>
                      {moment().subtract(1, 'month').format('MMM')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setDateFilter(3)}>
                    <Text
                      style={
                        dateFilter === 3 ? activeDateFilter : inActiveDateFilter
                      }>
                      {moment().subtract(2, 'month').format('MMM')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setDateFilter(4)}>
                    <Text
                      style={
                        dateFilter === 4 ? activeDateFilter : inActiveDateFilter
                      }>
                      {moment().subtract(3, 'month').format('MMM')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setDateFilter(5)}>
                    <Text
                      style={
                        dateFilter === 5 ? activeDateFilter : inActiveDateFilter
                      }>
                      View All
                    </Text>
                  </TouchableOpacity>
                </View>
                {completedOrders?.list?.map((order, index) => (
                  <View key={index}>{this.renderOrder(order)}</View>
                ))}
                {completedOrders?.list?.length < 1 && (
                  <View style={{padding: units.unit5}}>
                    <Text style={{textAlign: 'center'}}>No results found</Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    orders: state.orders,
    beds: state.beds,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBeds,
      getPlantActivities,
      getOrders,
      getPlantList,
      setSelectedOrder,
      getPlantSelection,
    },
    dispatch,
  );
}

Reports = connect(mapStateToProps, mapDispatchToProps)(Reports);

export default Reports;

module.exports = Reports;
