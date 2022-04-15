import React, {Component} from 'react';
import {View, Image, Text} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Paragraph from '../../components/UI/Paragraph';
import Label from '../../components/UI/Label';
import Collapse from '../../components/UI/Collapse';
import units from '../../components/styles/units';
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
          <Paragraph
            style={{
              fontWeight: 'bold',
              marginTop: units.unit5,
              marginBottom: units.unit5,
              display: index < 1 ? null : 'none',
              color: colors.greenE75,
            }}>
            {p.class.name} vegetables
          </Paragraph>
          <View
            style={{
              paddingVertical: units.unit4,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                paddingRight: units.unit4,
                marginRight: units.unit4,
                borderRightColor: '#ddd',
                borderRightWidth: 1,
              }}>
              <CheckBox
                value={this.state[p.name]}
                onValueChange={() => this.onSelect(p)}
                boxType="square"
                tintColor={colors.purpleB}
                onTintColor={colors.green0}
                onCheckColor={colors.green0}
                onFillColor={colors.purpleB}
              />
            </View>
            <Image
              style={{
                height: units.unit6,
                width: units.unit6,
                marginRight: units.unit4,
                borderRadius: units.unit3,
              }}
              source={{
                uri: p.image,
              }}
            />
            <Paragraph>{p.name}</Paragraph>
          </View>
        </View>
      ));
    });

    return list;
  }

  renderHerbs(herbs) {
    return herbs.map((h, index) => (
      <View key={index}>
        <View
          style={{
            padding: units.unit4,
            flex: 1,
            alignSelf: 'stretch',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              paddingRight: units.unit5,
              marginRight: units.unit5,
              borderRightColor: '#ddd',
              borderRightWidth: 1,
            }}>
            <CheckBox
              value={this.state[h.name]}
              onValueChange={() => this.onSelect(h)}
              boxType="square"
            />
          </View>
          <Image
            style={{
              height: units.unit6,
              width: units.unit6,
              marginRight: units.unit5,
              borderRadius: units.unit3,
            }}
            source={{
              uri: h.image,
            }}
          />
          <Paragraph>{h.name}</Paragraph>
        </View>
      </View>
    ));
  }

  onSelect(plant) {
    // determine selection state
    let select = !this.state[plant.name] ? true : false;

    // set selection state
    this.setState({[plant.name]: select});

    // set selected plants
    let selectedPlants = this.state.selectedPlants;

    // if deselecting {...}
    if (!select) {
      const index = selectedPlants.findIndex(p => p.name === plant.name);
      selectedPlants.splice(index, 1);
    } else {
      // if selecting {...}
      selectedPlants.push(plant);
    }

    // return value
    this.props.onSelect(this.state.selectedPlants);
  }

  render() {
    const {selectedPlants} = this.state;
    const {plants, title = 'Plant Selection'} = this.props;

    if (plants && plants.vegetables && plants.herbs && plants.fruit) {
      // set available plants
      const vegetables = this.renderPlants(plants.vegetables);
      const herbs = this.renderHerbs(plants.herbs);
      const fruit = this.renderPlants(plants.fruit);

      // set selected plants
      const selectedVegetables = selectedPlants.filter(
        plant => plant.category.name === 'vegetable',
      );
      const selectedHerbs = selectedPlants.filter(
        plant => plant.category.name === 'herb',
      );
      const selectedFruit = selectedPlants.filter(
        plant => plant.category.name === 'fruit',
      );

      return (
        <View>
          <Text style={{marginBottom: units.unit5, color: colors.greenD75}}>
            Select a minimum of 5 plants, and a maximum of 20
          </Text>
          <View
            style={{
              paddingBottom: units.unit3,
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
              Selected: {selectedPlants.length}
            </Paragraph>
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
                    style={{fontSize: fonts.h3, color: colors.greenD75}}>
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
                    style={{fontSize: fonts.h3, color: colors.greenD75}}>
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
                    style={{fontSize: fonts.h3, color: colors.greenD75}}>
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
        </View>
      );
    }

    return <Paragraph>Loading...</Paragraph>;
  }
}

module.exports = PlantList;
