// libraries
import React, {Component} from 'react';
import {View, Modal, Text, TouchableOpacity, Image} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';

// UI components
import CircularButton from '../UI/CircularButton';
import Input from '../UI/Input';
import Button from '../UI/Button';
import Link from '../UI/Link';
import Card from '../UI/Card';
import SizeIndicator from '../UI/SizeIndicator';
import Header from '../UI/Header';
import Dropdown from '../UI/Dropdown';

// helpers
import formatMenuData from '../../helpers/formatMenuData';

// styles
import units from '../styles/units';
import fonts from '../styles/fonts';
import colors from '../styles/colors';

class PlantMenu extends Component {
  state = {
    plantQty: 0,
    search: '',
    sortOrder: 'ascending',
    sortKey: 'name',
    menuType: 'list',
    selectedPlants: [],
    selectedPlant: null,
  };

  selectPlant(plant) {
    let selectedPlants = this.state.selectedPlants;
    const selectedPlant = plant;
    const plantQty = 1;

    if (selectedPlants.length > 0) {
      if (selectedPlants[0].common_type._id !== plant.common_type._id) {
        // clear previous selection
        selectedPlants = [];
      }
    }

    // add plant to list of selected plants
    selectedPlants.push(plant);

    // update UI
    this.setState({
      selectedPlants,
      selectedPlant,
      plantQty,
    });
  }

  searchPlants(value) {
    this.setState({search: value});
  }

  renderHeader() {
    return (
      <View
        style={{
          paddingHorizontal: units.unit4,
          marginTop: units.unit6,
          marginBottom: units.unit3,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Link
          onPress={() => {
            this.setState({plantQty: 0});
            this.props.close();
          }}
          icon={
            <Ionicons
              name="chevron-back"
              size={fonts.h3}
              color={colors.purpleB}
            />
          }
          text={'Back'}
        />
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => this.setState({menuType: 'grid'})}
            style={{
              borderRadius: 5,
              marginRight: units.unit2,
              backgroundColor:
                this.state.menuType === 'grid' ? colors.purple4 : colors.white,
              padding: units.unit3,
            }}>
            <Ionicons
              name="grid-outline"
              size={fonts.h2}
              color={colors.purpleB}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({menuType: 'list'})}
            style={{
              borderRadius: 5,
              backgroundColor:
                this.state.menuType === 'list' ? colors.purple4 : colors.white,
              padding: units.unit3,
            }}>
            <Ionicons
              name="list-outline"
              size={fonts.h2}
              color={colors.purpleB}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderGridMenu() {
    const rows = formatMenuData(
      this.props.vegetables,
      this.props.herbs,
      this.props.fruit,
    ).sort((a, b) => b.quadrant_size - a.quadrant_size);
    const {selectedPlant} = this.state;

    return (
      <View style={{backgroundColor: colors.greenE10}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
          }}>
          {/* columns */}
          {rows.map((column, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  background: 'red',
                  flexBasis: '25%',
                  padding: units.unit2,
                }}
                onPress={() => this.selectPlant(column)}>
                <View
                  style={{
                    backgroundColor: colors.white75,
                    borderRadius: units.unit3,
                    height: units.unit6 + units.unit4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}>
                  {!column.isEmpty && (
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                      }}>
                      <Image
                        source={{uri: column.common_type.image}}
                        style={{
                          height: '100%',
                          width: '100%',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                        }}
                      />
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          backgroundColor: colors.white,
                          paddingLeft: units.unit2,
                          paddingTop: units.unit2,
                          paddingBottom: units.unit2,
                        }}>
                        <SizeIndicator size={column.quadrant_size} />
                      </View>
                      {selectedPlant && column._id === selectedPlant._id && (
                        <View
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: units.unit2,
                            paddingRight: units.unit2,
                            paddingTop: units.unit2,
                          }}>
                          <View
                            style={{
                              backgroundColor: colors.purple1,
                              borderRadius: 25,
                            }}>
                            <Ionicons
                              name="checkmark"
                              size={fonts.h3}
                              color={colors.white}
                            />
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  renderListMenu() {
    let listItems = formatMenuData(
      this.props.vegetables,
      this.props.herbs,
      this.props.fruit,
      this.state.search,
    ).sort((a, b) => b.quadrant_size - a.quadrant_size);

    const selectedPlants = this.state.selectedPlants;

    return (
      <View style={{marginTop: units.unit2, backgroundColor: colors.greenE10}}>
        {listItems.map((li, index) => {
          const plantSelected = selectedPlants.find(
            plant => plant._id === li._id,
          );
          return (
            <View
              key={index}
              style={{
                paddingHorizontal: units.unit3,
                paddingVertical: units.unit2,
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (!plantSelected) {
                    this.selectPlant(li);
                  }
                }}>
                <Card
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
                      alignItems: 'center',
                    }}>
                    {
                      <Ionicons
                        name={
                          !plantSelected ? 'ellipse-outline' : 'checkmark-done'
                        }
                        size={fonts.h3}
                        color={plantSelected ? colors.purpleB : colors.purpleB}
                      />
                    }
                    <Image
                      source={{uri: li.common_type.image}}
                      style={{
                        height: units.unit5,
                        width: units.unit5,
                        marginRight: units.unit3,
                        marginLeft: units.unit4,
                      }}
                    />
                    <View>
                      <Text>{li.common_type.name}</Text>
                    </View>
                  </View>
                  <SizeIndicator size={li.quadrant_size} />
                </Card>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  }

  renderPlantMenu() {
    switch (this.state.menuType) {
      case 'grid':
        return this.renderGridMenu();
      case 'list':
        return this.renderListMenu();
      default:
        return this.renderGridMenu();
    }
  }

  renderMenuOptions() {
    const {plantQty, selectedPlant} = this.state;
    const {plants} = this.props;

    const varieties = plants
      .map(p => {
        if (selectedPlant) {
          if (p.common_type._id === selectedPlant.common_type._id) {
            return {
              label: p.name,
              value: p._id,
            };
          }
        }
      })
      .filter(variety => variety !== undefined);

    console.log('selectedPlant');
    console.log(selectedPlant);

    console.log('varieties');
    console.log(varieties);

    return (
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.purpleB,
          padding: units.unit4,
        }}>
        {/* plant variety dropdown */}
        <View style={{paddingHorizontal: units.unit3}}>
          <Dropdown
            disabled={plantQty < 1}
            label="Variety"
            value={selectedPlant ? selectedPlant._id : 'none'}
            options={
              selectedPlant ? varieties : [{label: 'None', value: 'none'}]
            }
            onChange={value => {
              // do stuff...
            }}
          />
        </View>
        <View
          style={{
            padding: units.unit4,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          {/* subtract button */}
          <View>
            <CircularButton
              small
              disabled={plantQty === 0 || !selectedPlant}
              variant="btn2"
              icon={
                <Ionicons
                  name={'remove-outline'}
                  color={colors.purpleB}
                  size={fonts.h3}
                />
              }
              onPress={() => {
                this.setState({
                  plantQty: plantQty - 1,
                });
              }}
            />
          </View>

          {/* qty output */}
          <View>
            <Header>{plantQty}</Header>
          </View>

          {/* add button */}
          <View>
            <CircularButton
              small
              variant="btn2"
              disabled={!selectedPlant}
              icon={
                <Ionicons name={'add'} color={colors.purpleB} size={fonts.h3} />
              }
              onPress={() => {
                this.setState({
                  plantQty: plantQty + 1,
                });
              }}
            />
          </View>
        </View>
        <Button
          disabled={plantQty < 1}
          text="Submit"
          style={{width: '100%'}}
          onPress={() => {
            // add plant
            this.props.addPlant({
              plant: {
                id: this.state.selectedPlant,
              },
              qty: plantQty,
            });

            // clear selections
            this.setState({
              selectedPlant: null,
              selectedPlants: [],
              plantQty: 0,
            });

            // close modal
            this.props.close();
          }}
        />
        <View
          style={{
            marginTop: units.unit4,
            display: 'flex',
            alignItems: 'center',
          }}>
          <Link
            text="Request new plant variety"
            onPress={() => {}}
          />
        </View>
      </View>
    );
  }

  renderSearchBar() {
    return (
      <View style={{paddingHorizontal: units.unit3}}>
        <Input
          onChange={value => this.searchPlants(value)}
          value={this.state.search}
          placeholder="Search..."
        />
      </View>
    );
  }

  render() {
    const {isOpen = false} = this.props;

    return (
      <View>
        <Modal
          animationType="slide"
          visible={isOpen}
          presentationStyle="fullScreen">
          <View style={{height: '95%'}}>
            {/* header */}
            {this.renderHeader()}

            {/* search bar */}
            {this.state.menuType === 'list' && this.renderSearchBar()}

            {/* plant menu */}
            <KeyboardAwareScrollView>
              {this.renderPlantMenu()}
            </KeyboardAwareScrollView>

            {/* menu options */}
            {this.renderMenuOptions()}
          </View>
        </Modal>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    drafts: state.drafts,
    beds: state.beds,
    plants: state.plants,
  };
}

PlantMenu = connect(mapStateToProps, null)(PlantMenu);

export default PlantMenu;

module.exports = PlantMenu;
