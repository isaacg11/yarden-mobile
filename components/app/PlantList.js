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

    const list = plantList.map(plant => {
      return plant.map((p, index) => (
        <View key={index}>
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            display: index < 1 ? null : 'none'
          }}>
            <Paragraph
              style={{
                fontWeight: 'bold',
                marginTop: units.unit5,
                marginBottom: units.unit4,
                color: colors.greenE75,
              }}>
              {capitalize(p.common_type.name)}
            </Paragraph>
            <Image
              style={{
                height: units.unit5,
                width: units.unit5,
                marginRight: units.unit4,
                borderRadius: units.unit3,
                marginLeft: units.unit4
              }}
              source={{
                uri: p.common_type.image,
              }}
            />
          </View>
          <View
            style={{
              paddingVertical: units.unit4,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
            <View
              style={{
                paddingRight: units.unit4,
                marginRight: units.unit4,
                paddingVertical: units.unit4,
                display: 'flex',
                flexDirection: 'row',
              }}>
              <Image
                style={{
                  height: units.unit6,
                  width: units.unit6,
                  borderRadius: units.unit3,
                  marginRight: units.unit4
                }}
                source={{
                  uri: p.image,
                }}
              />
              <View>
                <Paragraph style={{ marginBottom: units.unit3, marginTop: units.unit2 }}>{capitalize(p.name)}</Paragraph>
                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <CircularButton
                    small
                    variant="btn2"
                    style={{ marginRight: units.unit4 }}
                    icon={(<Ionicons
                      name={'add'}
                      color={colors.purpleB}
                      size={fonts.h3}
                    />)}
                    onPress={() => this.onSelect('add', p, index)}
                  />
                  <CircularButton
                    small
                    variant="btn2"
                    icon={(<Ionicons
                      name={'remove-outline'}
                      color={colors.purpleB}
                      size={fonts.h3}
                    />)}
                    onPress={() => this.onSelect('remove', p, index)}
                  />
                </View>
              </View>
            </View>
            <Header>{this.state[`${p.name}-${p.common_type.name}-${index}`] || 0}</Header>
          </View>
        </View>
      ));
    });

    return list;
  }

  onSelect(action, plant, index) {
    const currentValue = this.state[`${plant.name}-${plant.common_type.name}-${index}`] === undefined ? 0 : this.state[`${plant.name}-${plant.common_type.name}-${index}`];
    const newValue = (action === 'add') ? currentValue + 1 : currentValue - 1;

    // do not allow negative values
    if (newValue < 0) return;

    const progress = parseFloat((((this.props.usedPlotPoints + plant.quadrant_size) / this.props.allowablePlotPoints).toFixed(2) * 100).toFixed(2));

    if (progress > 100) return alert('You do not have enough space in your garden beds to fit this additional plant. Please try a smaller plant or removing others to make space for the desired one.');

    // set new value
    this.setState({ [`${plant.name}-${plant.common_type.name}-${index}`]: newValue });

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
      beds
    } = this.props;

    const progress = parseFloat(((usedPlotPoints / allowablePlotPoints).toFixed(2) * 100).toFixed(2));

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
        <View>

          <View>
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
                alignItems: 'center'
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
          <Divider />

          <ScrollView>
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

        </View>
      );
    }

    return <Paragraph>Loading...</Paragraph>;
  }
}

module.exports = PlantList;
