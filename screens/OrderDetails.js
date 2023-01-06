// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import { alert } from '../components/UI/SystemAlert';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Collapse from '../components/UI/Collapse';
import Button from '../components/UI/Button';
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import ImageGrid from '../components/app/ImageGrid';
import OrderInfo from '../components/app/OrderInfo';
import ChangeOrders from '../components/app/ChangeOrders';
import Plants from '../components/app/Plants';

// actions
import { getOrders, updateOrder } from '../actions/orders/index';
import { getChangeOrders } from '../actions/changeOrders/index';
import { getBeds } from '../actions/beds/index';
import { getDrafts } from '../actions/drafts/index';
import { getReports } from '../actions/reports/index';
import { getReportType } from '../actions/reportTypes/index';
import { getQuestions } from '../actions/questions/index';
import { getAnswers } from '../actions/answers/index';

// types
import types from '../vars/types';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class OrderDetails extends Component {
  state = {
    changeOrders: [],
  };

  async componentDidMount() {

    // show loading indicator
    this.setState({ isLoading: true });

    const order = this.props.route.params;
    let changeOrders = [];

    // if order type is installation, revive, or misc {...}
    if (order.type == types.INSTALLATION || order.type == types.REVIVE || order.type == types.MISC) {
      // get change orders
      changeOrders = await this.props.getChangeOrders(
        `order=${order._id}`,
        true,
      );
    }

    let wateringSchedule = [];

    // if current user is a gardener {...}
    if (this.props.user.type === types.GARDENER) {

      // get beds
      await this.props.getBeds(`customer=${order.customer._id}`);

      // get report type
      const reportType = await this.props.getReportType(`name=${order.type}`);

      // get questions
      await this.props.getQuestions(`report_type=${reportType._id}`);

      // get previous maintenance reports for customer
      await this.props.getReports(`customer=${order.customer._id}&type=${reportType._id}`);

      // if order type is initial planting {...}
      if (order.type == types.INITIAL_PLANTING) {

        // get drafts
        await this.props.getDrafts(`order=${order._id}`);
      }

      // if order for maintenance service {...}
      if (order.type === types.FULL_PLAN || order.type === types.ASSISTED_PLAN) {
        if(this.props.reports.length > 0) {
          const latestReport = this.props.reports[this.props.reports.length - 1];

          // get answers
          const answers = await this.props.getAnswers(`report=${latestReport._id}`);
          
          // set watering schedule
          wateringSchedule = answers.filter((answer) => answer.question.placement === 5);
        } else {
          // get report type
          const initialPlantingReportType = await this.props.getReportType(`name=${types.INITIAL_PLANTING}`);

          // get previous maintenance reports for customer
          await this.props.getReports(`customer=${order.customer._id}&type=${initialPlantingReportType._id}`);

          const latestReport = this.props.reports[this.props.reports.length - 1];

          // get answers
          const answers = await this.props.getAnswers(`report=${latestReport._id}`);
          
          // set watering schedule
          wateringSchedule = answers.filter((answer) => answer.question.placement === 5);
        }
      }
    }

    // hide loading indicator
    this.setState({
      isLoading: false,
      changeOrders,
      wateringSchedule
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
        await this.props.updateOrder(this.props.route.params._id, {
          status: 'cancelled',
        });

        // get pending orders
        await this.props.getOrders(
          `status=pending&start=none&end=${new Date(moment().add(1, 'year'))}`,
        );

        // hide loading indicator
        this.setState({ isLoading: false });

        // navigate to orders
        this.props.navigation.navigate('Orders');
      },
      true,
    );
  }

  requestChanges() {
    // navigate to request change page
    this.props.navigation.navigate(
      'Request Order Change',
      this.props.route.params,
    );
  }

  render() {
    const order = this.props.route.params;
    const { user, beds } = this.props;
    const { isLoading, changeOrders, wateringSchedule } = this.state;
    const gardenInfo = order.customer.garden_info;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
        }}>
        <ScrollView>
          <View style={{ padding: units.unit3 + units.unit4 }}>

            {/* loading indicator (dynamically visible) */}
            <LoadingIndicator loading={isLoading} />

            {/* header */}
            <Header type="h4" style={{ marginBottom: units.unit5 }}>
              Order Details
            </Header>

            <View>
              {/* order info */}
              <Card>
                <OrderInfo
                  order={order}
                  wateringSchedule={wateringSchedule}
                  onChangeDate={() =>
                    this.props.navigation.navigate('Change Date', { order })
                  }
                  onCancel={() => this.cancel()}
                />
              </Card>

              {/* change orders (dynamically visible) */}
              {changeOrders.length > 0 && (
                <View style={{ marginTop: units.unit4 }}>
                  <Collapse
                    title={`Change Orders (${changeOrders.length})`}
                    open={changeOrders.find(
                      changeOrder => changeOrder.status === 'pending approval',
                    )}
                    content={
                      <ChangeOrders
                        changeOrders={changeOrders}
                        onPress={changeOrder =>
                          this.props.navigation.navigate(
                            'Change Order Details',
                            changeOrder,
                          )
                        }
                      />
                    }
                  />
                </View>
              )}

              {/* order images (dynamically visible) */}
              {order.images.length > 0 && (
                <View>
                  <ImageGrid images={order.images} />
                </View>
              )}

              {/* request changes button (dynamically visible) */}
              {order.status === 'pending' &&
                user.type === 'customer' &&
                (order.type === 'installation' ||
                  order.type === 'revive' ||
                  order.type === 'misc') && (
                  <View style={{ marginTop: units.unit4 }}>
                    <Button
                      text="Request Changes"
                      onPress={() => this.requestChanges()}
                      icon={
                        <Ionicons
                          name="create-outline"
                          size={units.unit4}
                          color={colors.purpleB}
                        />
                      }
                    />
                  </View>
                )}

              {/* initial planting UI (dynamically visible) */}
              {order.status === 'pending' &&
                user.type === 'gardener' &&
                order.type === 'initial planting' &&
                gardenInfo && (
                  <View style={{ marginTop: units.unit4 }}>

                    {/* plant lists */}
                    {beds.length > 0 && (
                      <View>
                        <View>
                          <Collapse
                            title="Vegetables"
                            content={
                              <Plants
                                plants={gardenInfo.vegetables}
                                order={order}
                                onNavigateToSubstitution={(selectedPlant) => this.props.navigation.navigate('Substitution', { selectedPlant, order })}
                              />
                            }
                          />
                        </View>
                        <View>
                          <Collapse
                            title="Herbs"
                            content={
                              <Plants
                                plants={gardenInfo.herbs}
                                order={order}
                                onNavigateToSubstitution={(selectedPlant) => this.props.navigation.navigate('Substitution', { selectedPlant, order })}
                              />
                            }
                          />
                        </View>
                        <View>
                          <Collapse
                            title="Fruit"
                            content={
                              <Plants
                                plants={gardenInfo.fruit}
                                order={order}
                                onNavigateToSubstitution={(selectedPlant) => this.props.navigation.navigate('Substitution', { selectedPlant, order })}
                              />
                            }
                          />
                        </View>
                      </View>
                    )}

                    {/* buttons */}
                    <Button
                      variant={beds.length < 1 ? 'button' : 'btn2'}
                      text={`${beds.length < 1
                        ? 'Build Garden Map'
                        : 'View Garden Beds'
                        } `}
                      onPress={() =>
                        this.props.navigation.navigate('Beds', { order })
                      }
                      icon={
                        <Ionicons
                          name="grid-outline"
                          size={units.unit4}
                          color={colors.purpleB}
                        />
                      }
                    />
                    <Button
                      style={{
                        display: beds.length < 1 ? 'none' : 'flex',
                        marginTop: units.unit4,
                      }}
                      text="Process Order"
                      onPress={() => this.props.navigation.navigate('Step 5', { isInitialPlanting: true })}
                    />
                  </View>
                )}

              {/* maintenance UI (dynamically visible) */}
              {order.status === 'pending' &&
                user.type === 'gardener' &&
                (order.type === types.FULL_PLAN || order.type === types.ASSISTED_PLAN) && (
                  <View>
                    <Button
                      style={{
                        marginTop: units.unit4
                      }}
                      variant="btn2"
                      text="View Garden Beds"
                      onPress={() =>
                        this.props.navigation.navigate('Beds', { order })
                      }
                      icon={
                        <Ionicons
                          name="grid-outline"
                          size={units.unit4}
                          color={colors.purpleB}
                        />
                      }
                    />
                    <Button
                      style={{
                        marginTop: units.unit4
                      }}
                      text="Process Order"
                      onPress={() => this.props.navigation.navigate('Step 1')}
                    />
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
    beds: state.beds,
    questions: state.questions,
    reports: state.reports
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOrders,
      updateOrder,
      getChangeOrders,
      getBeds,
      getDrafts,
      getReportType,
      getQuestions,
      getReports,
      getAnswers
    },
    dispatch,
  );
}

OrderDetails = connect(mapStateToProps, mapDispatchToProps)(OrderDetails);

export default OrderDetails;

module.exports = OrderDetails;
