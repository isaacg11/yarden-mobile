// libraries
import React, {Component} from 'react';
import {SafeAreaView, View, ScrollView, Text} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import {alert} from '../components/UI/SystemAlert';
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
import {getOrders, updateOrder} from '../actions/orders/index';
import {getChangeOrders} from '../actions/changeOrders/index';
import {getBeds, updateBed} from '../actions/beds/index';
import {getDrafts} from '../actions/drafts/index';
import {getReports} from '../actions/reports/index';
import {getReportType} from '../actions/reportTypes/index';
import {getQuestions} from '../actions/questions/index';
import {getAnswers} from '../actions/answers/index';
import {getPlantList, updatePlantList} from '../actions/plantList/index';
import {getSpecialRequest} from '../actions/specialRequests/index';
import {getPlantSelection} from '../actions/plantSelection';

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
    renderPlantSelection: false,
    isLoading: true,
  };

  async componentDidMount() {
    const order = this.props.route.params;
    let changeOrders = [];
    let wateringSchedule = [];
    let specialRequest = false;
    let plantSelection = false;

    // if order type is installation, revive, or misc {...}
    if (
      order.type == types.INSTALLATION ||
      order.type == types.REVIVE ||
      order.type == types.MISC
    ) {
      // get change orders
      changeOrders = await this.props.getChangeOrders(
        `order=${order._id}`,
        true,
      );
    }

    // if current user is a gardener {...}
    if (this.props.user.type === types.GARDENER) {
      specialRequest = await this.props.getSpecialRequest(`order=${order._id}`);

      // get beds
      await this.props.getBeds(`customer=${order.customer._id}`);

      // get report type
      const reportType = await this.props.getReportType(`name=${order.type}`);

      // get questions
      await this.props.getQuestions(`report_type=${reportType._id}`);

      // if order type is initial planting or crop rotation {...}
      if (
        order.type == types.INITIAL_PLANTING ||
        order.type == types.CROP_ROTATION
      ) {
        // get plant list
        await this.props.getPlantList(`order=${order._id}`);

        plantSelection = await this.props.getPlantSelection(order.customer._id);

        // if order type is initial planting {...}
        if (order.type == types.INITIAL_PLANTING) {
          // get drafts
          await this.props.getDrafts(`order=${order._id}`);
        }
      } else if (
        order.type === types.FULL_PLAN ||
        order.type === types.ASSISTED_PLAN
      ) {
        // if order for maintenance service {...}

        // get previous reports for customer
        await this.props.getReports(`customer=${order.customer._id}`);

        // get latest report
        const latestReport = await this.getLatestReport();

        if (latestReport) {
          // get answers
          const answers = await this.props.getAnswers(
            `report=${latestReport._id}`,
          );

          // set watering schedule
          wateringSchedule = answers.filter(
            answer => answer.question.placement === 5,
          );
        }
      }
    }

    // hide loading indicator
    this.setState({
      isLoading: false,
      changeOrders,
      wateringSchedule,
      specialRequest,
      plantSelection,
    });
  }

  async getLatestReport() {
    // get latest report
    let latestReport = null;
    let newestDate = null;
    for (const report of this.props.reports) {
      const date = new Date(report.dt_created);
      if (!newestDate || date > newestDate) {
        latestReport = report;
        newestDate = date;
      }
    }

    return latestReport;
  }

  cancel() {
    // render confirm alert
    alert(
      'Once this action is taken, it cannot be undone',
      'Are you sure?',
      async () => {
        // render loading indicator
        this.setState({isLoading: true});

        // update order to cancelled status
        await this.props.updateOrder(this.props.route.params._id, {
          status: 'cancelled',
        });

        // get pending orders
        await this.props.getOrders(
          `status=pending&start=none&end=${new Date(moment().add(1, 'year'))}`,
        );

        // hide loading indicator
        this.setState({isLoading: false});

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

  async generatePlotPoints(rows, columns) {
    // set initial plot points list
    let plotPoints = [];

    // set initial plot points id
    let plotPointId = 0;

    // iterate rows
    for (let i = 0; i < rows; i++) {
      // set initial row value
      let row = [];

      // iterate columns
      for (let j = 0; j < columns; j++) {
        // set plot point id
        plotPointId += 1;

        // set row
        row.push({
          id: plotPointId,
          plant: null,
          selected: false,
        });
      }

      // set plot points
      plotPoints.push(row);
    }

    return plotPoints;
  }

  async onSelectPlant(updatedPlantList) {
    // show loading indicator
    this.setState({isLoading: true});

    // update plant list
    await this.props.updatePlantList(
      this.props.plantList._id,
      updatedPlantList,
    );

    // get plant list
    await this.props.getPlantList(`order=${this.props.route.params._id}`);

    // NOTE: This timeout is necessary to give the loading indicator time to render
    // Author: Isaac G. 5/3/23
    setTimeout(() => {
      // hide loading indicator
      this.setState({isLoading: false});
    }, 1000);
  }

  render() {
    const order = this.props.route.params;
    const {user, drafts, beds, orders, plantList} = this.props;
    const {
      isLoading,
      changeOrders,
      wateringSchedule,
      specialRequest,
      plantSelection,
    } = this.state;

    let cropRotationSelectionComplete = plantSelection;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
        }}>
        <ScrollView>
          <View style={{padding: units.unit3 + units.unit4}}>
            {/* loading indicator () */}
            <LoadingIndicator loading={isLoading} />

            {/* header */}
            <Header type="h4" style={{marginBottom: units.unit5}}>
              Order Details
            </Header>

            <View>
              {/* order info */}
              <Card>
                <OrderInfo
                  order={order}
                  wateringSchedule={wateringSchedule}
                  specialRequest={specialRequest?.description}
                  onChangeDate={() =>
                    this.props.navigation.navigate('Change Date', {order})
                  }
                  onCancel={() => this.cancel()}
                />
              </Card>

              {/* change orders () */}
              {changeOrders.length > 0 && (
                <View style={{marginTop: units.unit4}}>
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

              {/* order images () */}
              {order.images.length > 0 && (
                <View>
                  <ImageGrid images={order.images} />
                </View>
              )}

              {/* plant selections () */}
              {order.status === 'pending' &&
                user.type === types.CUSTOMER &&
                (order.type === types.INSTALLATION ||
                  order.type === types.REVIVE) && (
                  <View style={{marginTop: units.unit4}}>
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
                        <PlantSelection plants={order.bid.line_items.herbs} />
                      }
                    />
                    <Collapse
                      title="Fruit"
                      content={
                        <PlantSelection plants={order.bid.line_items.fruit} />
                      }
                    />
                  </View>
                )}

              {/* request changes button () */}
              {order.status === 'pending' &&
                user.type === types.CUSTOMER &&
                (order.type === types.INSTALLATION ||
                  order.type === types.REVIVE ||
                  order.type === types.MISC) && (
                  <View style={{marginTop: units.unit4}}>
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

              {/* initial planting UI () */}
              {order.status === 'pending' &&
                user.type === types.GARDENER &&
                order.type === types.INITIAL_PLANTING && (
                  <View style={{marginTop: units.unit4}}>
                    {/* plant lists */}
                    {drafts.filter(draft => draft.published).length ===
                      this.props.drafts.length &&
                      plantList && (
                        <View>
                          <View>
                            <Collapse
                              title="Vegetables"
                              content={
                                <Plants
                                  plants={plantList.vegetables}
                                  plantListId={plantList._id}
                                  order={order}
                                  onNavigateToSubstitution={selectedPlant =>
                                    this.props.navigation.navigate(
                                      'Substitution',
                                      {selectedPlant, order},
                                    )
                                  }
                                  onSelectPlant={updatedPlantList =>
                                    this.onSelectPlant(updatedPlantList)
                                  }
                                />
                              }
                            />
                          </View>
                          <View>
                            <Collapse
                              title="Herbs"
                              content={
                                <Plants
                                  plants={plantList.herbs}
                                  plantListId={plantList._id}
                                  order={order}
                                  onNavigateToSubstitution={selectedPlant =>
                                    this.props.navigation.navigate(
                                      'Substitution',
                                      {selectedPlant, order},
                                    )
                                  }
                                  onSelectPlant={updatedPlantList =>
                                    this.onSelectPlant(updatedPlantList)
                                  }
                                />
                              }
                            />
                          </View>
                          <View>
                            <Collapse
                              title="Fruit"
                              content={
                                <Plants
                                  plants={plantList.fruit}
                                  plantListId={plantList._id}
                                  order={order}
                                  onNavigateToSubstitution={selectedPlant =>
                                    this.props.navigation.navigate(
                                      'Substitution',
                                      {selectedPlant, order},
                                    )
                                  }
                                  onSelectPlant={updatedPlantList =>
                                    this.onSelectPlant(updatedPlantList)
                                  }
                                />
                              }
                            />
                          </View>
                        </View>
                      )}

                    {/* buttons */}
                    <Button
                      variant={
                        drafts.find(draft => !draft.published)
                          ? 'button'
                          : 'btn2'
                      }
                      text={`${
                        drafts.find(draft => !draft.published)
                          ? 'Build Garden Map'
                          : 'View Garden Beds'
                      } `}
                      onPress={() =>
                        this.props.navigation.navigate('Beds', {order})
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
                        display: drafts.find(draft => !draft.published)
                          ? 'none'
                          : 'flex',
                        marginTop: units.unit4,
                      }}
                      text="Process Order"
                      onPress={() =>
                        this.props.navigation.navigate('Step 5', {
                          isInitialPlanting: true,
                        })
                      }
                    />
                  </View>
                )}

              {/* maintenance UI () */}
              {order.status === 'pending' &&
                user.type === types.GARDENER &&
                (order.type === types.FULL_PLAN ||
                  order.type === types.ASSISTED_PLAN) && (
                  <View>
                    <View>
                      <Button
                        style={{
                          marginTop: units.unit4,
                        }}
                        variant="btn2"
                        text="View Garden Beds"
                        onPress={() =>
                          this.props.navigation.navigate('Beds', {order})
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
                          marginTop: units.unit4,
                        }}
                        text="Process Order"
                        onPress={() => this.props.navigation.navigate('Step 1')}
                      />
                    </View>
                  </View>
                )}

              {/* plant selections () */}
              {order.status === 'pending' &&
                order.type === types.CROP_ROTATION &&
                user.type === types.GARDENER &&
                cropRotationSelectionComplete && (
                  <View style={{marginTop: units.unit4}}>
                    <View>
                      {/* buttons */}
                      <Button
                        variant="btn2"
                        text="Build Garden Map"
                        onPress={() =>
                          this.props.navigation.navigate('Beds', {order})
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
                        style={{marginTop: units.unit4}}
                        variant="btn2"
                        text="View Plant List"
                        onPress={() =>
                          this.props.navigation.navigate('Plants', {
                            plantSelection,
                          })
                        }
                        icon={
                          <Ionicons
                            name="list-outline"
                            size={units.unit4}
                            color={colors.purpleB}
                          />
                        }
                      />
                      <Button
                        style={{
                          marginTop: units.unit4,
                        }}
                        text="Process Order"
                        onPress={() =>
                          this.props.navigation.navigate('Step 5', {order})
                        }
                      />
                    </View>
                  </View>
                )}

              {/* crop rotation selection incomplete () */}
              {order.status === 'pending' &&
                order.type === types.CROP_ROTATION &&
                user.type === types.GARDENER &&
                !cropRotationSelectionComplete && (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      padding: units.unit5,
                    }}>
                    <View style={{display: 'flex', alignItems: 'center'}}>
                      <Ionicons
                        name="information-circle-outline"
                        size={units.unit4}
                        color={colors.purpleB}
                        size={units.unit5}
                      />
                      <Text>
                        The customer has not selected their plants for the crop
                        rotation, please check back later.
                      </Text>
                    </View>
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
    answers: state.answers,
    reports: state.reports,
    orders: state.orders,
    plantList: state.plantList,
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
      getAnswers,
      updateBed,
      getPlantList,
      updatePlantList,
      getSpecialRequest,
      getPlantSelection,
    },
    dispatch,
  );
}

OrderDetails = connect(mapStateToProps, mapDispatchToProps)(OrderDetails);

export default OrderDetails;

module.exports = OrderDetails;
