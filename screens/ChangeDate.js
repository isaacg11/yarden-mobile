// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Dropdown from '../components/UI/Dropdown';
import Label from '../components/UI/Label';
import DateSelect from '../components/UI/DateSelect';
import Button from '../components/UI/Button';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import { alert } from '../components/UI/SystemAlert';
import Header from '../components/UI/Header';
import Radio from '../components/UI/Radio';

// actions
import { updateOrder, getOrders } from '../actions/orders/index';
import { createReschedule } from '../actions/reschedules/index';
import { sendSms } from '../actions/sms/index';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';
import card from '../components/styles/card';

// types
import types from '../vars/types';

class ChangeDate extends Component {

  state = {
    changeFutureEvents: 'no'
  };

  async save() {

    // render loading indicator
    this.setState({ isLoading: true });
    const currentOrder = this.props.route.params.order;

    // format new date
    let newDate = {
      date: this.state.date
    };

    if (currentOrder.time) {
      newDate.time = this.state.time;
    }

    // update order with new date
    await this.props.updateOrder(currentOrder._id, newDate);

    // if maintenance order {...}
    if (currentOrder.type === types.FULL_PLAN || currentOrder.type === types.ASSISTED_PLAN) {
      const nextOrderDate = (currentOrder.type === types.FULL_PLAN) ? moment(currentOrder.date).add(1, 'week').startOf('day') : moment(currentOrder.date).add(2, 'weeks').startOf('day');
      if (this.state.changeFutureEvents === 'no') {
        const reschedule = {
          date: nextOrderDate,
          order: currentOrder._id
        }

        // create a reschedule
        await this.props.createReschedule(reschedule);
      }
    }

    // get pending orders
    await this.props.getOrders(
      `status=${types.PENDING}&start=none&end=${new Date(moment().add(1, 'year'))}`,
    );

    // hide loading indicator
    this.setState({ isLoading: false });

    const alertMessage = (this.props.user.type === types.CUSTOMER) ? `Your order date has been changed` : `Your order date has been changed and the customer has been notified`;

    // render success alert
    alert(alertMessage, 'Success!', () =>
      this.props.navigation.navigate('Orders'),
    );
  }

  render() {
    const { date, time, isLoading } = this.state;
    const { order } = this.props.route.params;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: colors.greenC5,
        }}>
        {/* loading indicator start */}
        <LoadingIndicator loading={isLoading} />

        <View
          style={{
            padding: units.unit3 + units.unit4,
            flexDirection: 'column',
            justifyContent: 'space-between',
            display: 'flex',
            flex: 1,
          }}>
          {/* change date form start */}

          <View>
            <Header type="h4" style={{ marginBottom: units.unit5 }}>
              Change Date
            </Header>

            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: units.unit5,
              }}>
              <View>
                <Label>Order Date</Label>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    ...card,
                    paddingHorizontal: units.unit5,
                  }}>
                  <Text style={{ ...fonts.label, color: colors.greenD50 }}>
                    {moment(order.date).format('dddd')}
                  </Text>
                  <Text
                    style={{
                      fontSize: fonts.h2,
                      lineHeight: fonts.h1,
                      color: colors.greenD50,
                    }}>
                    {moment(order.date).format('MM/DD')}
                  </Text>
                  {(order.time) && (
                    <Text style={{ ...fonts.small, color: colors.greenD50 }}>
                      {`${moment(order.time, `HH:mm:ss`).format(
                        `h:mm A`,
                      )}`}
                    </Text>
                  )}
                </View>
              </View>

              <View style={{ marginTop: fonts.h4 }}>
                <Ionicons
                  name="arrow-forward"
                  size={fonts.h1}
                  color={colors.greenA}
                />
              </View>
              <View>
                <Label>New Date</Label>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    ...card,
                    paddingHorizontal: units.unit5,
                  }}>
                  <Text
                    style={{
                      ...fonts.label,
                      color: colors.greenE75,
                      fontWeight: 'bold',
                    }}>
                    {date ? moment(date).format('dddd') : 'day'}
                  </Text>
                  <Text
                    style={{
                      fontSize: fonts.h2,
                      lineHeight: fonts.h1,
                      color: colors.greenE75,
                      fontWeight: 'bold',
                    }}>
                    {date ? moment(date).format('MM/DD') : 'mm/dd'}
                  </Text>
                  {(order.time) && (
                    <Text
                      style={{
                        ...fonts.small,
                        color: colors.greenE75,
                        fontWeight: 'bold',
                      }}>
                      {time ? `${moment(time, `HH:mm:ss`).format(
                        `h:mm A`,
                      )}` : 'Time...'}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View style={{ marginBottom: units.unit4 }}>
              <DateSelect
                mode="date"
                value={date}
                date={new Date()}
                placeholder="Choose a new date..."
                minDate={new Date()}
                onConfirm={value => {
                  this.setState({
                    date: value,
                  });
                }}
                appearance="dropdown"
              />
            </View>
            {(order.time) && (
              <View>
                <Dropdown
                  label="Time"
                  onChange={value => this.setState({ time: value })}
                  options={[
                    {
                      label: 'Same Time',
                      value: order.time,
                    },
                    {
                      label: '9:00 AM',
                      value: '09',
                    },
                    {
                      label: '10:00 AM',
                      value: '10',
                    },
                    {
                      label: '11:00 AM',
                      value: '11',
                    },
                    {
                      label: '12:00 PM',
                      value: '12',
                    },
                    {
                      label: '1:00 PM',
                      value: '13',
                    },
                    {
                      label: '2:00 PM',
                      value: '14',
                    },
                    {
                      label: '3:00 PM',
                      value: '15',
                    },
                    {
                      label: '4:00 PM',
                      value: '16',
                    },
                    {
                      label: '5:00 PM',
                      value: '17',
                    },
                  ]}
                  placeholder="Choose a new time..."
                />
              </View>
            )}
            {(order.type === types.FULL_PLAN || order.type === types.ASSISTED_PLAN) && (
              <View>
                <View
                  style={{
                    ...card
                  }}>
                  <Header type="h6" style={{ marginBottom: units.unit4 }}>
                    Change all future events?
                  </Header>
                  <Radio
                    defaultValue={'no'}
                    options={
                      [
                        { name: 'YES', value: 'yes', helperText: `Schedule next order ${order.type === types.FULL_PLAN ? '1 week' : '2 weeks'} from newly updated order date` },
                        { name: 'NO', value: 'no', helperText: `Schedule next order ${order.type === types.FULL_PLAN ? '1 week' : '2 weeks'} from original date ${moment(order.date).format('MM/DD/YYYY')}` }
                      ]
                    }
                    onChange={(value) => this.setState({
                      changeFutureEvents: value
                    })}
                  />
                </View>
              </View>
            )}
          </View>
          <View style={{ marginTop: units.unit4 }}>
            <Button
              text="Save Changes"
              onPress={() => this.save()}
              disabled={!date || (order.time && !time)}
              icon={
                <Ionicons name="save" size={fonts.h4} color={colors.purpleB} />
              }
            />
          </View>
        </View>

        {/* change date form end */}
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
      user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateOrder,
      getOrders,
      createReschedule,
      sendSms
    },
    dispatch,
  );
}

ChangeDate = connect(mapStateToProps, mapDispatchToProps)(ChangeDate);

export default ChangeDate;

module.exports = ChangeDate;
