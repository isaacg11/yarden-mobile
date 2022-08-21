import React, { Component } from 'react';
import { View, Modal, Text, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Slider } from '@miblanchard/react-native-slider';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Collapse from '../UI/Collapse';
import Header from '../UI/Header';
import Link from '../UI/Link';
import Label from '../UI/Label';
import {
    createToken,
    createCustomer,
    deleteCard,
    createCard,
} from '../../actions/cards/index';
import { updateUser } from '../../actions/user/index';
import separatePlantsByCommonType from '../../helpers/separatePlantsByCommonType';
import units from '../styles/units';
import fonts from '../styles/fonts';
import colors from '../styles/colors';

class PlantMenu extends Component {

    state = {
        qty: 0
    };

    renderPlants(p) {

        // get plants
        const plants = separatePlantsByCommonType(p);

        // set initial value for plant list
        const plantList = [];

        // iterate through plants
        for (let item in plants) {

            // create a text string for each plant in the common type group
            const plantMenu = plants[item].map((plant, index) => (
                <View key={index}>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            padding: units.unit3
                        }}>
                        <View>
                            <Label>Type</Label>
                            <Text>{plant.id.name} {plant.id.common_type.name}</Text>
                        </View>
                        <View>
                            <Label>Planted</Label>
                            <Text>0 / {plant.qty}</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: units.unit3
                        }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text>{this.state[`qty-${plant.id.name}-${plant.id.common_type.name}`] || 0}</Text>
                        </View>
                        <View style={{
                            flex: 3,
                            marginLeft: 10,
                            marginRight: 10,
                            alignItems: 'stretch',
                            justifyContent: 'center',
                        }}>
                            <Slider
                                value={this.state[`qty-${plant.id.name}-${plant.id.common_type.name}`]}
                                onValueChange={(value) => this.setState({ [`qty-${plant.id.name}-${plant.id.common_type.name}`]: value })}
                                step={1}
                                maximumValue={3}
                            />
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => {

                                    // add plant
                                    this.props.addPlant({
                                        plant,
                                        additionalQty: this.state[`qty-${plant.id.name}-${plant.id.common_type.name}`][0] || 0
                                    });

                                    // close modal
                                    this.props.close();
                                }
                                }>
                                <Ionicons
                                    name={'add'}
                                    color={colors.purpleB}
                                    size={fonts.h3}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))

            // add plant common type collapse
            plantList.push(
                <View>
                    <Collapse
                        title={item}
                        content={plantMenu}
                    />
                </View>
            )
        }

        // map the plant list
        return plantList.map((plant, index) => (
            <View key={index}>
                <TouchableOpacity>
                    {plant}
                </TouchableOpacity>
            </View>
        ));
    }

    render() {
        const {
            isOpen = false,
            close
        } = this.props;

        return (
            <View>
                {/* plant menu modal */}
                <Modal
                    animationType="slide"
                    visible={isOpen}
                    presentationStyle="fullScreen">
                    <KeyboardAwareScrollView
                        style={{
                            backgroundColor: colors.greenE10,
                            paddingVertical: units.unit5,
                            paddingHorizontal: units.unit4 + units.unit3,
                            paddingBottom: units.unit6,
                        }}>
                        <View style={{ marginTop: units.unit5 }}>
                            <Link
                                icon={
                                    <Ionicons
                                        name="chevron-back"
                                        size={fonts.h3}
                                        color={colors.purpleB}
                                    />
                                }
                                text={'Back'}
                                onPress={() => close()}
                            />
                            <Header
                                style={{
                                    ...fonts.header,
                                    paddingTop: units.unit5,
                                    paddingBottom: units.unit4,
                                }}>
                                Customer Plants
                            </Header>
                        </View>

                        {/* vegetables */}
                        <View>
                            <Text
                                className="capitalize"
                                style={{
                                    fontWeight: 'bold',
                                    marginTop: units.unit5,
                                    marginBottom: units.unit5,
                                }}>
                                Vegetables
                            </Text>
                            {this.renderPlants(this.props.vegetables)}
                        </View>

                        {/* herbs */}
                        <View>
                            <Text
                                className="capitalize"
                                style={{
                                    fontWeight: 'bold',
                                    marginTop: units.unit5,
                                    marginBottom: units.unit5,
                                }}>
                                Herbs
                            </Text>
                            {this.renderPlants(this.props.herbs)}
                        </View>

                        {/* fruit */}
                        <View>
                            <Text
                                className="capitalize"
                                style={{
                                    fontWeight: 'bold',
                                    marginTop: units.unit5,
                                    marginBottom: units.unit5,
                                }}>
                                Fruit
                            </Text>
                            {this.renderPlants(this.props.fruit)}
                        </View>
                    </KeyboardAwareScrollView>
                </Modal>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            createToken,
            createCustomer,
            updateUser,
            deleteCard,
            createCard,
        },
        dispatch,
    );
}

PlantMenu = connect(mapStateToProps, mapDispatchToProps)(PlantMenu);

export default PlantMenu;

module.exports = PlantMenu;
