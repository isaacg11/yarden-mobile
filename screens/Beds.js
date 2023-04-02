// libraries
import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import Paragraph from '../components/UI/Paragraph';
import Button from '../components/UI/Button';
import ProgressIndicator from '../components/UI/ProgressIndicator';
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';

// actions
import { createBed, getBeds } from '../actions/beds/index';
import { updateDraft, getDrafts } from '../actions/drafts/index';

// helpers
import calculatePlantingProgress from '../helpers/calculatePlantingProgress';
import formatDimensions from '../helpers/formatDimensions';
import formatMenuData from '../helpers/formatMenuData';
import getPlantedList from '../helpers/getPlantedList';
import capitalize from '../helpers/capitalize';

// types
import types from '../vars/types';

class Beds extends Component {

  state = {};

  publish() {
    // show loading indicator
    this.setState({ isLoading: true });

    let createBeds = [];
    const drafts = this.props.drafts;

    // iterate through drafts
    drafts.forEach(draft => {
      const newBed = {
        name: `Garden Bed ${draft.key}`,
        customer: this.props.route.params.order.customer._id,
        draft: draft._id,
        key: draft.key,
        plot_points: draft.plot_points,
        width: draft.width,
        length: draft.length,
        height: draft.height,
        shape: draft.shape,
      };

      createBeds.push(
        new Promise(async resolve => {

          // create bed
          await this.props.createBed(newBed);

          // update draft status as published
          await this.props.updateDraft(draft._id, { published: true });

          resolve();
        }),
      );
    });

    // create beds
    Promise.all(createBeds).then(async () => {

      // get drafts
      await this.props.getDrafts(`order=${this.props.route.params.order._id}`);

      // get beds
      await this.props.getBeds(`customer=${this.props.route.params.order.customer._id}`);

      // redirect user to "planted" screen
      this.props.navigation.navigate('Planted');

      // hide loading indicator
      this.setState({ isLoading: false });
    });
  }

  next() {
    switch (this.props.route.params.serviceReport) {
      case types.DEAD_PLANTS:
        return this.props.navigation.navigate('Step 2', { order: this.props.route.params.order });
      case types.HARVESTED_PLANTS:
        return this.props.navigation.navigate('Step 3', { order: this.props.route.params.order });
      case types.NEW_PLANTS:
        return this.props.navigation.navigate('Step 4', { order: this.props.route.params.order });
      default:
        return this.props.navigation.navigate('Step 1', { order: this.props.route.params.order });
    }
  }

  renderHelperText() {
    switch (this.props.route.params.order.type) {
      case types.INITIAL_PLANTING:
        return (this.props.drafts.find((draft) => !draft.published)) ? 'Build and publish the garden map before starting the initial planting so you can use it as a guide while working.' : '';
      case types.CROP_ROTATION:
        return 'Build the garden map before starting the crop rotation so you can use it as a guide while working.';
      case types.FULL_PLAN:
        switch (this.props.route.params.serviceReport) {
          case types.DEAD_PLANTS:
            return 'Tap on each garden bed where you found dead plants. Use the number on the garden bed to identify which bed to use for reporting.';
          case types.HARVESTED_PLANTS:
            return 'Tap on each garden bed where you harvested. Use the number on the garden bed to identify which bed to use for reporting.';
          case types.NEW_PLANTS:
            return 'Tap on each garden bed where added new plants. Use the number on the garden bed to identify which bed to use for reporting.';
          default:
            return '';
        }
      case types.ASSISTED_PLAN:
        switch (this.props.route.params.serviceReport) {
          case types.DEAD_PLANTS:
            return 'Tap on each garden bed where you found dead plants. Use the number on the garden bed to identify which bed to use for reporting.';
          case types.HARVESTED_PLANTS:
            return 'Tap on each garden bed where you harvested. Use the number on the garden bed to identify which bed to use for reporting.';
          case types.NEW_PLANTS:
            return 'Tap on each garden bed where added new plants. Use the number on the garden bed to identify which bed to use for reporting.';
          default:
            return '';
        }
      default:
        return '';
    }
  }

  renderButton(progress) {
    switch (this.props.route.params.order.type) {
      case types.INITIAL_PLANTING:
        return (
          <View style={{ display: (this.props.drafts.find((draft) => !draft.published)) ? "flex" : "none" }}>
            <Button
              icon={
                <Ionicons
                  name="share"
                  size={fonts.h3}
                  color={colors.purpleB}
                />
              }
              disabled={progress < 100 ? true : false}
              text="Publish Garden"
              variant="button"
              onPress={() => this.publish()}
            />
            <Text style={{ color: colors.greenD75, marginTop: units.unit4 }}>
              Tapping the "Publish Garden" button will make your garden layout visible to the customer. Once this action is taken, it cannot be undone.
            </Text>
          </View>
        )
      case types.FULL_PLAN:
        if (this.props.route.params.serviceReport) {
          return (
            <View>
              <Button
                alignIconRight
                icon={
                  <Ionicons
                    name="arrow-forward-outline"
                    size={fonts.h3}
                    color={colors.purpleB}
                  />
                }
                text="Next"
                variant="button"
                onPress={() => this.next()}
              />
            </View>
          )
        }
      case types.ASSISTED_PLAN:
        if (this.props.route.params.serviceReport) {
          return (
            <View>
              <Button
                alignIconRight
                icon={
                  <Ionicons
                    name="arrow-forward-outline"
                    size={fonts.h3}
                    color={colors.purpleB}
                  />
                }
                text="Next"
                variant="button"
                onPress={() => this.next()}
              />
            </View>
          )
        }
      default:
        return (<View></View>)
    }
  }

  renderProgress(progress, label) {
    const order = this.props.route.params.order;
    if (order.type === types.INITIAL_PLANTING) { // if initial planting {...}

      // check to make sure all drafts have been published
      const published = this.props.drafts.filter((draft) => draft.published).length === this.props.drafts.length;

      // if already published
      if (published) {

        // hide progress indicator
        return <></>;
      }
    }

    return (
      <View style={{ marginBottom: units.unit3, marginTop: units.unit4 }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: units.unit3,
          }}>
          <Text style={{ ...fonts.label, marginRight: units.unit3 }}>
            Planted
          </Text>
          <Text style={{ ...fonts.label, textAlign: 'center' }}>{label}</Text>
        </View>
        <ProgressIndicator progress={progress} />
      </View>
    );
  }

  renderBeds() {
    const order = this.props.route.params.order;
    const serviceReport = this.props.route.params.serviceReport;
    const drafts = this.props.drafts;
    const beds = this.props.beds;

    let rows = [];
    let columns = [];

    if (order.type === types.INITIAL_PLANTING) {
      drafts.forEach((draft) => columns.push(draft));
    } else {
      beds.forEach((bed) => columns.push(bed));
    }

    const size = 2;
    while (columns.length > 0) rows.push(columns.splice(0, size));

    return rows.map((row, i) => {
      return (
        <View
          key={i}
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexBasis: 0.5,
          }}>
          {row.map((column, index) => {
            const bedId = column.key;
            const bed = column;

            return (
              <TouchableOpacity
                style={{
                  paddingLeft: index % 2 === 0 ? 0 : units.unit3 + units.unit2,
                  paddingRight: index % 2 === 0 ? units.unit3 + units.unit2 : 0,
                  display: 'flex',
                  justifyContent: 'center',
                  width: '50%',
                }}
                key={index}
                onPress={() =>
                  this.props.navigation.navigate('Bed', { bed, order, bedId, serviceReport })
                }>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: units.unit2,
                  }}>
                  <Paragraph style={{ ...fonts.label }}>#{bedId}</Paragraph>
                  <Paragraph style={{ ...fonts.label }}>
                    {calculatePlantingProgress(bed)}
                  </Paragraph>
                </View>
                <Card
                  style={{
                    marginBottom: units.unit4,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={{
                      uri: 'https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/raised-bed-01.png',
                    }}
                    style={{
                      width: 100,
                      height: 100,
                    }}
                  />
                  <View style={{ display: 'flex', alignItems: 'center' }}>
                    <Paragraph
                      style={{
                        maxWidth: '100%',
                        textAlign: 'center',
                        color: colors.purpleB,
                        fontSize: fonts.h4,
                      }}>
                      {bed.name || `Garden #${bedId}`}
                    </Paragraph>
                    <Paragraph
                      style={{
                        ...fonts.label,
                        marginTop: units.unit0,
                        textAlign: 'center',
                      }}>
                      {formatDimensions(column)}
                    </Paragraph>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    });
  }

  render() {
    const { isLoading } = this.state;
    const { drafts, beds } = this.props;
    const order = this.props.route.params.order;
    let gardenInfo = null;

    if (order.type === types.INITIAL_PLANTING) {
      gardenInfo = order.bid.line_items;
    }

    let label = null;
    let progress = 0;

    if (gardenInfo) {

      // calculate total plants
      let totalPlants = 0;
      gardenInfo.vegetables.forEach(vegetable => (totalPlants += vegetable.qty));
      gardenInfo.herbs.forEach(herb => (totalPlants += herb.qty));
      gardenInfo.fruit.forEach(fr => (totalPlants += fr.qty));

      let completePlants = 0;
      let pendingPlants = 0;

      const rows = formatMenuData(
        gardenInfo.vegetables,
        gardenInfo.herbs,
        gardenInfo.fruit,
      );

      const plantingData = (order.type === types.INITIAL_PLANTING) ? drafts : beds;

      // if plants exist {...}
      if (plantingData.length > 0) {

        const planted = getPlantedList(plantingData);

        rows.forEach(column => {

          // check drafts for plant
          const plantIsSaved = planted.find(plant => plant.key === column.key);

          // if plant is saved {...}
          if (plantIsSaved) {
            completePlants += 1;
          } else {
            pendingPlants += 1;
          }
        });
      } else {
        pendingPlants = totalPlants;
      }

      // set progress
      progress =
        pendingPlants === 0
          ? 100
          : (completePlants / (pendingPlants + completePlants)) * 100;

      label = `${completePlants} / ${pendingPlants + completePlants}`;
    }

    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: colors.greenE10,
        }}>
        <ScrollView>
          <View style={{ padding: units.unit3 + units.unit4 }}>

            {/* loading indicator */}
            <LoadingIndicator loading={isLoading} />

            {/* header */}
            <Header type="h4">Garden Beds</Header>

            {/* customer info */}
            <Text style={{ marginTop: units.unit2 }}>
              {capitalize(
                `${order.customer.first_name} ${order.customer.last_name}`,
              )}
            </Text>
            <Text>{capitalize(`${order.customer.address}`)}</Text>
            <Text>
              {capitalize(`${order.customer.city}`)},{' '}
              <Text style={{ textTransform: 'uppercase' }}>
                {order.customer.state}
              </Text>{' '}
              {order.customer.zip_code}
            </Text>

            {/* helper text (dynamically visible) */}
            <View
              style={{
                marginTop: units.unit3,
                paddingTop: units.unit3,
                borderTopWidth: 1,
                borderTopColor: colors.greenD10,
              }}>
              <Text style={{ color: colors.greenE50 }}>
                {this.renderHelperText()}
              </Text>
            </View>

            {/* progress indicator (dynamically visible) */}
            {(order.type === types.INITIAL_PLANTING) && this.renderProgress(progress, label)}

            {/* garden beds list */}
            <View style={{ marginTop: units.unit4 }}>
              {this.renderBeds()}
            </View>

            {/* button */}
            {this.renderButton(progress)}

          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    drafts: state.drafts,
    beds: state.beds,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createBed,
      updateDraft,
      getDrafts,
      getBeds
    },
    dispatch,
  );
}

Beds = connect(mapStateToProps, mapDispatchToProps)(Beds);

export default Beds;

module.exports = Beds;
