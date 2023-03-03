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
import PlantSelection from '../components/app/PlantSelection';

// actions
import { getOrders, updateOrder } from '../actions/orders/index';
import { getChangeOrders } from '../actions/changeOrders/index';
import { getBeds } from '../actions/beds/index';
import { getDrafts } from '../actions/drafts/index';
import { getReports } from '../actions/reports/index';
import { getReportType } from '../actions/reportTypes/index';
import { getQuestions } from '../actions/questions/index';
import { getAnswers } from '../actions/answers/index';

// helpers
import getSeason from '../helpers/getSeason';

// types
import types from '../vars/types';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class OrderDetails extends Component {
  state = {
    changeOrders: [],
    renderPlantSelection: false
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

      // if order type is initial planting or crop rotation {...}
      if (order.type == types.INITIAL_PLANTING || order.type == types.CROP_ROTATION) {

        // get drafts
        await this.props.getDrafts(`order=${order._id}`);
      }

      // if order for maintenance service {...}
      if (order.type === types.FULL_PLAN || order.type === types.ASSISTED_PLAN) {
        if (this.props.reports.length > 0) {
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

    // if order type is crop rotation {...}
    let renderPlantSelection = false;
    if (order.type == types.CROP_ROTATION) {

      // if current user is a gardener {...}
      if (this.props.user.type === types.CUSTOMER) {

        // get current season
        const currentSeason = getSeason();

        if (this.props.user.garden_info.vegetables.length > 0) {
          const previousSeasonVegetable = this.props.user.garden_info.vegetables.find((v) => {
            const vegetable = v.id || v;
            if ((vegetable.season !== types.ANNUAL) && (vegetable.season !== currentSeason)) return true;
          });

          if (previousSeasonVegetable) renderPlantSelection = true;
        }

        if (this.props.user.garden_info.herbs.length > 0) {
          const previousSeasonHerb = this.props.user.garden_info.herbs.find((h) => {
            const herb = h.id || h;
            if ((herb.season !== types.ANNUAL) && (herb.season !== currentSeason)) return true;
          });

          if (previousSeasonHerb) renderPlantSelection = true;
        }

        if (this.props.user.garden_info.fruit.length > 0) {
          const previousSeasonFruit = this.props.user.garden_info.fruit.find((f) => {
            const fruit = f.id || f;
            if ((fruit.season !== types.ANNUAL) && (fruit.season !== currentSeason)) return true;
          });

          if (previousSeasonFruit) renderPlantSelection = true;
        }
      }
    }

    // hide loading indicator
    this.setState({
      isLoading: false,
      changeOrders,
      wateringSchedule,
      renderPlantSelection
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

  setPlants() {

  }

  render() {
    const order = this.props.route.params;
    const { user, beds, drafts } = this.props;
    const {
      isLoading,
      changeOrders,
      wateringSchedule,
      renderPlantSelection
    } = this.state;

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

              {/* plant selections (dynamically visible) */}
              {order.status === 'pending' &&
                user.type === types.CUSTOMER &&
                (order.type === types.INSTALLATION || order.type === types.REVIVE) && (
                  <View style={{ marginTop: units.unit4 }}>
                    <Collapse
                      title="Vegetables"
                      content={
                        <PlantSelection
                          plants={order.bid.line_items.vegetables}
                        />
                      }
                    />
                    <Collapse
                      title="Herbs"
                      content={
                        <PlantSelection
                          plants={order.bid.line_items.herbs}
                        />
                      }
                    />
                    <Collapse
                      title="Fruit"
                      content={
                        <PlantSelection
                          plants={order.bid.line_items.fruit}
                        />
                      }
                    />
                  </View>
                )}

              {/* request changes button (dynamically visible) */}
              {order.status === 'pending' &&
                user.type === types.CUSTOMER &&
                (order.type === types.INSTALLATION ||
                  order.type === types.REVIVE ||
                  order.type === types.MISC) && (
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
                user.type === types.GARDENER &&
                order.type === types.INITIAL_PLANTING && (
                  <View style={{ marginTop: units.unit4 }}>

                    {/* plant lists */}
                    {drafts.length > 0 && (
                      <View>
                        <View>
                          <Collapse
                            title="Vegetables"
                            content={
                              <Plants
                                plants={order.bid.line_items.vegetables}
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
                                plants={order.bid.line_items.herbs}
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
                                plants={order.bid.line_items.fruit}
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
                      variant={(drafts.length < 1) ? 'button' : 'btn2'}
                      text={`${(drafts.length < 1)
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
                        display: (drafts.length < 1) ? 'none' : 'flex',
                        marginTop: units.unit4,
                      }}
                      text="Process Order"
                      onPress={() => this.props.navigation.navigate('Step 5', { isInitialPlanting: true })}
                    />
                  </View>
                )}

              {/* maintenance UI (dynamically visible) */}
              {order.status === 'pending' &&
                user.type === types.GARDENER &&
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

              {/* crop rotation UI (dynamically visible) */}
              {(renderPlantSelection && (order.status === 'pending')) && (
                <Button
                  style={{
                    marginTop: units.unit4
                  }}
                  text="Select Plants"
                  onPress={() => this.props.navigation.navigate('Garden', { isCropRotation: true })}
                />
              )}

              {/* plant selections (dynamically visible) */}
              {order.status === 'pending' &&
                order.type === types.CROP_ROTATION &&
                user.type === types.CUSTOMER && (
                  <View style={{ marginTop: units.unit4 }}>
                    <Collapse
                      title="Vegetables"
                      content={
                        <PlantSelection
                          plants={user.garden_info.vegetables}
                        />
                      }
                    />
                    <Collapse
                      title="Herbs"
                      content={
                        <PlantSelection
                          plants={user.garden_info.herbs}
                        />
                      }
                    />
                    <Collapse
                      title="Fruit"
                      content={
                        <PlantSelection
                          plants={user.garden_info.fruit}
                        />
                      }
                    />
                  </View>
                )}

              {/* plant selections (dynamically visible) */}
              {order.status === 'pending' &&
                order.type === types.CROP_ROTATION &&
                user.type === types.GARDENER &&
                drafts.length > 0 && (
                  <View style={{ marginTop: units.unit4 }}>
                    <View>
                      <Collapse
                        title="Vegetables"
                        content={
                          <Plants
                            plants={order.customer.garden_info.vegetables}
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
                            plants={order.customer.garden_info.herbs}
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
                            plants={order.customer.garden_info.fruit}
                            order={order}
                            onNavigateToSubstitution={(selectedPlant) => this.props.navigation.navigate('Substitution', { selectedPlant, order })}
                          />
                        }
                      />
                    </View>
                  </View>
                )}

              {/* crop rotation UI - gardener (dynamically visible) */}
              {order.status === 'pending' &&
                user.type === types.GARDENER &&
                order.type === types.CROP_ROTATION &&
                drafts.length > 0 && (
                  <View style={{ marginTop: units.unit4 }}>
                    <Button
                      text="Process Order"
                      onPress={() =>
                        this.props.navigation.navigate('Beds', { order })
                      }
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
    drafts: state.drafts,
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
