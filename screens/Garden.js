// libraries
import React, { Component } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CheckBox from '@react-native-community/checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Button from '../components/UI/Button';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import { alert } from '../components/UI/SystemAlert';
import ProgressIndicator from '../components/UI/ProgressIndicator';
import Paragraph from '../components/UI/Paragraph';
import Label from '../components/UI/Label';
import Collapse from '../components/UI/Collapse';
import CircularButton from '../components/UI/CircularButton';

// helpers
import getSeason from '../helpers/getSeason';
import setPlants from '../helpers/setPlants';
import calculatePlotPoints from '../helpers/calculatePlotPoints';
import capitalize from '../helpers/capitalize';
import calculateTotalFeet from '../helpers/calculateTotalFeet';

// actions
import { getOrders } from '../actions/orders/index';
import { createPlantList } from '../actions/plantList/index';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';

// types
import types from '../vars/types';

class Garden extends Component {
  state = {
    selectedPlants: [],
    customQty: false
  };

  async componentDidMount() {

    // show loading indicator
    this.setState({ isLoading: true });

    // set plants
    const plants = await setPlants(this.props.plants);

    // update UI
    this.setState({
      vegetables: plants.vegetables,
      herbs: plants.herbs,
      fruit: plants.fruit,
      isLoading: false,
    });
  }

  renderPlants(plants) {

    let plantList = [];

    for (let item in plants) {
      plantList.push(plants[item]);
    }

    const list = plantList.map((plant) => {
      return plant.map((p, index) => {
        if (index === 0) {
          return (
            <View
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: units.unit4
              }}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ display: (this.state.customQty) ? 'none' : 'flex', marginRight: units.unit4 }}>
                  <CheckBox
                    value={this.state[`${p.name}-${p.common_type.name}-${index}`]}
                    onValueChange={() => this.onCheck(p, index)}
                    boxType="square"
                    tintColor={colors.purpleB}
                    onTintColor={colors.green0}
                    onCheckColor={colors.green0}
                    onFillColor={colors.purpleB}
                  />
                </View>
                <Image
                  style={{
                    height: units.unit5,
                    width: units.unit5,
                    marginRight: units.unit3,
                  }}
                  source={{
                    uri: p.common_type.image,
                  }}
                />
                <Text>{capitalize(p.common_type.name)}</Text>
              </View>
              <View
                style={{
                  display: (this.state.customQty) ? 'flex' : 'none',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minWidth: units.unit7,
                }}>
                <CircularButton
                  small
                  variant="btn2"
                  icon={
                    <Ionicons
                      name={'remove-outline'}
                      color={colors.purpleB}
                      size={fonts.h3}
                    />
                  }
                  onPress={() => this.onSelect('remove', p, index)}
                />
                <Header>
                  {this.state[`${p.name}-${p.common_type.name}-${index}`] ||
                    0}
                </Header>
                <CircularButton
                  small
                  variant="btn2"
                  icon={
                    <Ionicons
                      name={'add'}
                      color={colors.purpleB}
                      size={fonts.h3}
                    />
                  }
                  onPress={() => this.onSelect('add', p, index)}
                />
              </View>
            </View>
          )
        }
      })
    })

    return list;
  }

  onSelect(action, plant, index) {
    const currentValue =
      this.state[`${plant.name}-${plant.common_type.name}-${index}`] ===
        undefined
        ? 0
        : this.state[`${plant.name}-${plant.common_type.name}-${index}`];
    const newValue = action === 'add' ? currentValue + 1 : currentValue - 1;

    // do not allow negative values
    if (newValue < 0) return;

    const progress = this.getProgress(plant.quadrant_size);

    if ((action === 'add') && (progress > 100))
      return alert(
        'You do not have enough space in your garden beds to fit this additional plant. Please try a smaller plant or removing others to make space for the desired one.',
      );

    // set new value
    this.setState({
      [`${plant.name}-${plant.common_type.name}-${index}`]: newValue,
    });

    // get selected plants
    let selectedPlants = [...this.state.selectedPlants];

    // if deselecting {...}
    if (action === 'remove') {
      const index = selectedPlants.findIndex(p => p.name === plant.name);
      selectedPlants.splice(index, 1);
    } else {
      // if selecting {...}
      selectedPlants.push(plant);
    }

    // update selected plants
    this.setState({ selectedPlants });
  }

  onCheck(plant, index) {

    // get the checked qty
    const checkedQty = this.state[`${plant.name}-${plant.common_type.name}-${index}`] ? 0 : 1;

    // set new value
    this.setState({
      [`${plant.name}-${plant.common_type.name}-${index}`]: checkedQty,
    }, () => {
      // get selected plants
      let selectedPlants = [...this.state.selectedPlants];

      if (this.state[`${plant.name}-${plant.common_type.name}-${index}`]) {
        // if selecting {...}
        selectedPlants.push(plant);
      } else {
        // if deselecting {...}
        const index = selectedPlants.findIndex(p => p.name === plant.name);
        selectedPlants.splice(index, 1);
      }

      // update selected plants
      this.setState({ selectedPlants });

    });
  }

  removeAdditionalQty(selectedPlants) {
    const resultMap = new Map();

    for (const obj of selectedPlants) {
      resultMap.set(obj._id, obj);
    }

    const deduplicatedArray = Array.from(resultMap.values());

    return deduplicatedArray;
  }

  getProgress(additionalValue = 0) {
    const plotPoints = this.getPlotPoints();
    const { allowablePlotPoints, usedPlotPoints } = plotPoints;
    const progress = parseFloat(
      (
        (
          (usedPlotPoints + additionalValue) /
          allowablePlotPoints
        ).toFixed(2) * 100
      ).toFixed(2),
    );

    return progress;
  }

  async next() {
    const progress = this.getProgress();
    const { customQty, selectedPlants } = this.state;
    const { isCropRotation, title, line_items } = this.props.route.params;
    let beds = [];
    let generatedResults = [];

    // validate plant selections
    if (customQty) {
      if (progress < 95) {
        return alert('Please select more plants, your garden must be at least 95% full to continue.');
      }
      if (progress > 100) {
        return alert('Your garden is over the max limit, which is 100%. Please update your selection to continue.');
      }
    } else {
      if (progress > 100) {
        return alert(
          'You selected too many plants to fit in your garden. Please remove some plants from your selection to continue.',
        );
      }
      if (selectedPlants.length < 1) {
        return alert('Please select at least 1 plant to continue.');
      }
    }

    // if not custom quantity, auto generate plants to fill up bed based on plant selections
    if (!customQty) {
      const resultMap = new Map();

      for (const obj of selectedPlants) {
        resultMap.set(obj._id, obj);
      }

      // the reason this de-duplication is necessary is for the following edge case: If a user selects custom quantity, selects multiple of one plant, then changes their mind and de-selects custom quantity. We need to make sure their is only one of each plant in that case.
      const deduplicatedArray = Array.from(resultMap.values());

      if (isCropRotation) {
        let currentBeds = this.props.beds.map((b) => b);
        let bedsWithQty = [];
        currentBeds.forEach((bed) => {
          const bedIndex = bedsWithQty.findIndex((b) => (b.width === bed.width) && (b.length === bed.length) && (b.height === bed.height));
          if (bedIndex >= 0) {
            bedsWithQty[bedIndex].qty += 1;
          } else {
            bed.qty = 1;
            bedsWithQty.push(bed);
          }
        })

        beds = bedsWithQty;
      } else {
        beds = line_items.beds;
      }

      const measurements = calculateTotalFeet(beds);

      // NOTE: Added buffer (10%) to allow room for different sizes. Do not remove!
      // Author - Isaac G. 8/19/23
      const buffer = parseInt((measurements.sqft * 0.1).toFixed(0));
      let bedSqft = measurements.sqft - buffer;

      // if plants selected do not fill up the entire bed, auto generate plants to fill up bed
      while (bedSqft > 0) {
        for (let i = 0; i < deduplicatedArray.length; i++) {
          const p = deduplicatedArray[i];
          const { quadrant_size } = p;
          const sqft = quadrant_size / 4;

          if (sqft <= bedSqft) {
            generatedResults.push(p);
            bedSqft -= sqft;
          } else {
            bedSqft = 0;
          }
        }
      }
    }

    // set garden plants
    const plantSelection = (customQty) ? selectedPlants : generatedResults;
    const plants = await setPlants(plantSelection);
    const vegetables = plants.vegetables;
    const fruit = plants.fruit;
    const herbs = plants.herbs;

    // set common plants
    let commonVegetables = [];
    let commonHerbs = [];
    let commonFruit = [];
    selectedPlants.forEach((p) => {
      if (p.category.name === types.VEGETABLE) {
        if (!commonVegetables.find((commonVegetable) => commonVegetable._id === p.common_type._id)) {
          commonVegetables.push(p.common_type);
        }
      } else if (p.category.name === types.CULINARY_HERB) {
        if (!commonHerbs.find((commonHerb) => commonHerb._id === p.common_type._id)) {
          commonHerbs.push(p.common_type);
        }
      } else if (p.category.name === types.FRUIT) {
        if (!commonFruit.find((commonFr) => commonFr._id === p.common_type._id)) {
          commonFruit.push(p.common_type);
        }
      }
    })

    // combine quote and plants
    let quoteAndPlants = {
      ...{ vegetables, herbs, fruit },
      ...{ quoteTitle: title },
    };

    // combine params
    const params = {
      ...this.props.route.params,
      ...{ plantSelections: [quoteAndPlants], isCheckout: true },
      ...{
        garden: {
          name: 'Custom',
          vegetables: commonVegetables,
          herbs: commonHerbs,
          fruit: commonFruit,
        }
      }
    };

    // navigate user to Confirm Plants screen
    this.props.navigation.navigate('Confirm Plants', params);
  }

  getPlotPoints() {
    const { selectedPlants } = this.state;
    const { line_items, isCropRotation } = this.props.route.params;
    const beds = isCropRotation
      ? this.props.beds
      : line_items.beds;
    let allowablePlotPoints = 0;
    let usedPlotPoints = 0;

    if (selectedPlants.length > 0) {
      selectedPlants.forEach(plant => {
        usedPlotPoints += plant.quadrant_size * (plant.qty ? plant.qty : 1);
      });
    }

    beds.forEach(bed => {
      const multiplier = (isCropRotation) ? 1 : bed.qty;
      allowablePlotPoints += calculatePlotPoints(bed) * multiplier;
    });

    // NOTE: Added buffer (10%) to allow room for different sizes. Do not remove!
    // Author - Isaac G. 2/28/23
    const buffer = parseInt((allowablePlotPoints * 0.1).toFixed(0));

    allowablePlotPoints = allowablePlotPoints - buffer;

    return {
      usedPlotPoints,
      allowablePlotPoints,
    };
  }

  render() {
    const { isLoading } = this.state;

    if (isLoading) {
      return (<LoadingIndicator loading={true} />);
    } else {
      const {
        customQty,
        selectedPlants,
        vegetables,
        herbs,
        fruit,
      } = this.state;

      const {
        user,
        title = 'Plant Selection',
      } = this.props;

      const progress = this.getProgress();
      const isCropRotation = this.props.route.params.isCropRotation;
      const beds = isCropRotation
        ? user.garden_info.beds
        : this.props.route.params.line_items.beds;
      const measurements = calculateTotalFeet(beds);

      let selectedVegetables = selectedPlants.filter(
        plant => plant.category.name === 'vegetable',
      );
      let selectedHerbs = selectedPlants.filter(
        plant => plant.category.name === 'culinary herb',
      );
      let selectedFruit = selectedPlants.filter(
        plant => plant.category.name === 'fruit',
      );

      if (!customQty) {
        selectedVegetables = this.removeAdditionalQty(selectedVegetables);
        selectedHerbs = this.removeAdditionalQty(selectedHerbs);
        selectedFruit = this.removeAdditionalQty(selectedFruit);
      }

      return (
        <SafeAreaView
          style={{
            flex: 1,
            width: '100%',
          }}>
          <ScrollView stickyHeaderIndices={customQty ? [0] : []}>
            <View style={{ padding: units.unit3 + units.unit4, backgroundColor: colors.white }}>

              {/* header */}
              <Header type="h4">
                {isCropRotation ? 'Crop Rotation' : 'Garden Setup'}
              </Header>

              {/* helper text */}
              <Text style={{ marginTop: units.unit3 }}>Pick your plants for the {getSeason()} season by selecting a dropdown</Text>

              {/* progress indicator */}
              <View style={{ marginVertical: units.unit4, display: (customQty) ? 'flex' : 'none', }}>
                <ProgressIndicator progress={progress} />
              </View>

              {/* info panel */}
              <View
                style={{
                  display: (customQty) ? 'flex' : 'none',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Label>{title}</Label>
                <Paragraph
                  style={{
                    color: colors.purpleB,
                  }}>
                  {progress}% of garden filled ({measurements.sqft} Sq Ft)
                </Paragraph>
              </View>
            </View>
            <View style={{ paddingHorizontal: units.unit3 + units.unit4 }}>
              <View style={{ padding: 0 }}>

                {/* plant list */}
                <ScrollView
                  showsVerticalScrollIndicator={false}>

                  {/* vegetables */}
                  {vegetables && Object.keys(vegetables).length > 0 && (
                    <Collapse
                      title={
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                          }}>
                          <Paragraph
                            style={{ fontSize: fonts.h3, color: colors.greenD75 }}>
                            Vegetables
                          </Paragraph>
                          <Text
                            style={{
                              ...fonts.small,
                              color: colors.purpleB,
                              opacity: selectedVegetables.length < 1 ? 0.5 : 1,
                              fontFamily: fonts.default,
                            }}>
                            {selectedVegetables.length} Selected
                          </Text>
                        </View>
                      }
                      content={this.renderPlants(vegetables)}
                    />
                  )}

                  {/* herbs */}
                  {herbs && Object.keys(herbs).length > 0 && (
                    <Collapse
                      title={
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                          }}>
                          <Paragraph
                            style={{ fontSize: fonts.h3, color: colors.greenD75 }}>
                            Herbs
                          </Paragraph>
                          <Text
                            style={{
                              ...fonts.small,
                              color: colors.purpleB,
                              fontFamily: fonts.default,
                              opacity: selectedHerbs.length < 1 ? 0.5 : 1,
                            }}>
                            {selectedHerbs.length} Selected
                          </Text>
                        </View>
                      }
                      content={this.renderPlants(herbs)}
                    />
                  )}

                  {/* fruit */}
                  {fruit && Object.keys(fruit).length > 0 && (
                    <Collapse
                      title={
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                          }}>
                          <Paragraph
                            style={{ fontSize: fonts.h3, color: colors.greenD75 }}>
                            Fruit
                          </Paragraph>
                          <Text
                            style={{
                              ...fonts.small,
                              color: colors.purpleB,
                              fontFamily: fonts.default,
                              opacity: selectedFruit.length < 1 ? 0.5 : 1,
                            }}>
                            {selectedFruit.length} Selected
                          </Text>
                        </View>
                      }
                      content={this.renderPlants(fruit)}
                    />
                  )}
                </ScrollView>

                {/* qty checkbox */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: units.unit4,
                    marginTop: units.unit3,
                  }}>
                  <View
                    style={{ paddingRight: units.unit4, paddingLeft: units.unit3 }}>
                    <CheckBox
                      value={customQty}
                      onValueChange={() => this.setState({
                        customQty: !customQty,
                      })}
                      boxType="square"
                      tintColor={colors.purpleB}
                      onTintColor={colors.green0}
                      onCheckColor={colors.green0}
                      onFillColor={colors.purpleB}
                    />
                  </View>
                  <View>
                    <Text>Check here to set your own quantity</Text>
                  </View>
                </View>

                {/* navigation button */}
                <View>
                  <Button
                    text="Next"
                    variant="primary"
                    onPress={() => this.next()}
                  />
                </View>

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
    plants: state.plants,
    orders: state.orders,
    beds: state.beds
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOrders,
      createPlantList,
    },
    dispatch,
  );
}

Garden = connect(mapStateToProps, mapDispatchToProps)(Garden);

export default Garden;

module.exports = Garden;
