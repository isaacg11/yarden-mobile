// libraries
import React, { Component } from 'react';
import { View, Image, Text, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Paragraph from '../../components/UI/Paragraph';
import Label from '../../components/UI/Label';
import Collapse from '../../components/UI/Collapse';
import units from '../../components/styles/units';
import ProgressIndicator from '../../components/UI/ProgressIndicator';
import Divider from '../../components/UI/Divider';
import CircularButton from '../../components/UI/CircularButton';
import Header from '../../components/UI/Header';
import { alert } from '../../components/UI/SystemAlert';

// helpers
import capitalize from '../../helpers/capitalize';
import calculateTotalFeet from '../../helpers/calculateTotalFeet';

// styles
import colors from '../styles/colors';
import fonts from '../styles/fonts';

class PlantList extends Component {
  state = {
    selectedPlants: [],
  };

  renderPlants(plants) {
    let plantList = [];

    for (let item in plants) {
      plantList.push(plants[item]);
    }

    const list = plantList.map((plant, i) => {
      return plant.map((p, index) => (
        <View key={index}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              display: index < 1 ? null : 'none',
              width: '100%',
              marginVertical: units.unit5,
            }}>
            <Image
              style={{
                height: units.unit6 + units.unit4,
                width: units.unit6 + units.unit4,
                marginTop: units.unit3,
              }}
              source={{
                uri: p.common_type.image,
              }}
            />
            <Paragraph
              style={{
                color: colors.greenD75,
                fontSize: fonts.h3,
              }}>
              {capitalize(p.common_type.name)}
            </Paragraph>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                <Paragraph
                  style={{ marginBottom: units.unit3, color: colors.purpleB }}>
                  <Ionicons
                    name={'leaf-outline'}
                    color={colors.purpleB}
                  />{' '}
                  "{capitalize(p.name)}"
                </Paragraph>
                <Paragraph
                  style={{ marginBottom: units.unit3, color: colors.purpleB }}>
                  <Ionicons
                    name={'time-outline'}
                    color={colors.purpleB}
                  />{' '}
                  {p.days_to_mature} days to mature
                </Paragraph>
                <Paragraph
                  style={{ marginBottom: units.unit3, color: colors.purpleB }}>
                  <Ionicons
                    name={'resize-outline'}
                    color={colors.purpleB}
                  />{' '}
                  {(p.quadrant_size / 2) / 4} Sq Ft
                </Paragraph>
                <View
                  style={{
                    display: 'flex',
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
              <Image
                style={{
                  height: units.unit6 + units.unit3,
                  width: units.unit6 + units.unit3,
                  borderRadius: units.unit3,
                  marginLeft: 'auto',
                }}
                source={{
                  uri: p.image,
                }}
              />
            </View>
          </View>
          <Divider style={{ marginVertical: units.unit4 }} />
        </View>
      ));
    });

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

    const progress = parseFloat(
      (
        (
          (this.props.usedPlotPoints + plant.quadrant_size) /
          this.props.allowablePlotPoints
        ).toFixed(2) * 100
      ).toFixed(2),
    );

    if ((action === 'add') && (progress > 100))
      return alert(
        'You do not have enough space in your garden beds to fit this additional plant. Please try a smaller plant or removing others to make space for the desired one.',
      );

    // set new value
    this.setState({
      [`${plant.name}-${plant.common_type.name}-${index}`]: newValue,
    });

    // get selected plants
    let selectedPlants = this.state.selectedPlants;

    // if deselecting {...}
    if (action === 'remove') {
      const index = selectedPlants.findIndex(p => p.name === plant.name);
      selectedPlants.splice(index, 1);
    } else {
      // if selecting {...}
      selectedPlants.push(plant);
    }

    // return value
    this.props.onSelect(this.state.selectedPlants, progress);
  }

  render() {
    const { selectedPlants } = this.state;
    const {
      plants,
      title = 'Plant Selection',
      allowablePlotPoints,
      usedPlotPoints,
      beds,
    } = this.props;

    const progress = parseFloat(
      ((usedPlotPoints / allowablePlotPoints).toFixed(2) * 100).toFixed(2),
    );

    const measurements = calculateTotalFeet(beds);

    if (plants && plants.vegetables && plants.herbs && plants.fruit) {
      // set available plants
      const vegetables = this.renderPlants(plants.vegetables);
      const herbs = this.renderPlants(plants.herbs);
      const fruit = this.renderPlants(plants.fruit);

      // set selected plants
      const selectedVegetables = selectedPlants.filter(
        plant => plant.category.name === 'vegetable',
      );
      const selectedHerbs = selectedPlants.filter(
        plant => plant.category.name === 'culinary herb',
      );
      const selectedFruit = selectedPlants.filter(
        plant => plant.category.name === 'fruit',
      );

      return (
        <ScrollView
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}>
          <View style={{ backgroundColor: colors.white, marginBottom: units.unit3 }}>

            {/* progress indicator */}
            <View style={{ marginVertical: units.unit4 }}>
              <ProgressIndicator progress={progress} />
            </View>

            {/* info panel */}
            <View
              style={{
                paddingBottom: units.unit4,
                display: 'flex',
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
            <Divider />
          </View>

          {/* vegetables */}
          {Object.keys(vegetables).length > 0 && (
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
              content={vegetables}
            />
          )}

          {/* herbs */}
          {herbs.length > 0 && (
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
              content={herbs}
            />
          )}

          {/* fruit */}
          {Object.keys(fruit).length > 0 && (
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
              content={fruit}
            />
          )}
        </ScrollView>
      );
    }

    return <Paragraph>Loading...</Paragraph>;
  }
}

module.exports = PlantList;
