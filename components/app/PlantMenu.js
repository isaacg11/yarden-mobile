import React, { Component } from 'react';
import { View, Modal, Text, TouchableOpacity, Image } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Slider } from '@miblanchard/react-native-slider';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Collapse from '../UI/Collapse';
import Dropdown from '../UI/Dropdown';
import Input from '../UI/Input';
import Header from '../UI/Header';
import Link from '../UI/Link';
import Label from '../UI/Label';
import SizeIndicator from '../UI/SizeIndicator';
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
        qty: 0,
        status: 'pending',
        search: '',
        sortOrder: 'ascending',
        sortKey: 'name'
    };

    setStatus(status) {
        this.setState({ status });
    }

    setSortOrder(sortOrder) {
        this.setState({
            sortOrder
        })
    }

    setSortKey(sortKey) {
        this.setState({
            sortKey
        })
    }

    renderPlants(p) {

        // get plants
        const plants = separatePlantsByCommonType(p);

        // set initial value for plant list
        const plantList = [];

        const status = this.state.status;

        // iterate through plants
        for (let item in plants) {

            let plantedCount = 0;

            let renderDropdown = true;

            // create a section for each plant in the common type group
            const plantMenu = plants[item].map((plant, index) => {

                // get plants for category
                const categorySelection = this.props.plantSelections[`${plant.id.category.name}${plant.id.category.name !== 'fruit' ? 's' : ''}`];

                // set initial plant selected
                let plantSelected = false;

                // if category selection {...}
                if (categorySelection) {

                    // set plant selected
                    plantSelected = categorySelection.find((cs) => cs.id._id === plant.id._id);

                    // if plant selected {...}
                    if (plantSelected) {

                        // if planted qty has met the qty requested by customer {...}
                        if (plantSelected.planted === plant.qty) {

                            // increment completed count
                            plantedCount += 1;
                        }
                    }
                }

                // if status is pending {...}
                if (status === 'pending') {

                    // set render dropdown
                    renderDropdown = (plantedCount === plants[item].length) ? false : true;
                } else if (status === 'complete') {

                    // set render dropdown
                    renderDropdown = (plantedCount === plants[item].length) ? true : false;
                }

                // if render dropdown and search {...}
                if (renderDropdown && this.state.search) {

                    // check to see if search matches any plants
                    const match = plant.id.common_type.name.match(new RegExp(this.state.search));

                    // if match
                    if (match) {
                        // set render dropdown
                        renderDropdown = true;
                    } else {
                        // set render dropdown
                        renderDropdown = false;
                    }
                }

                return (
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
                                <Text>{plantSelected ? plantSelected.planted : 0} / {plant.qty}</Text>
                            </View>
                        </View>
                        {(plant.qty !== (plantSelected ? plantSelected.planted : 0)) && (
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
                                        maximumValue={plant.qty - (plantSelected ? plantSelected.planted : 0)}
                                    />
                                </View>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <TouchableOpacity
                                        onPress={async () => {

                                            const currentPlant = this.state[`qty-${plant.id.name}-${plant.id.common_type.name}`];

                                            if (currentPlant) {

                                                const additionalQty = currentPlant[0] || 0;

                                                if (additionalQty) {

                                                    // add plant
                                                    await this.props.addPlant({
                                                        plant,
                                                        additionalQty
                                                    });

                                                    this.setState({ [`qty-${plant.id.name}-${plant.id.common_type.name}`]: 0 })

                                                    // close modal
                                                    this.props.close();
                                                }
                                            }
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
                        )}
                    </View>
                )
            })

            if (renderDropdown) {

                // add plant common type collapse
                plantList.push(
                    <View>
                        <Collapse
                            title={item}
                            content={plantMenu}
                            icon={<SizeIndicator size={plants[item][0].id.quadrant_size} />}
                            icon2={<Image
                                source={{ uri: plants[item][0].id.common_type.image }}
                                style={{width: 25, height: 25}}
                            />}
                        />
                    </View>
                )
            }
        }

        if (plantList.length < 1) {
            return (<Text>No results found</Text>)
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

    renderTabs() {
        const status = this.state.status;

        return (
            <View style={{ display: "flex", flexDirection: "row", marginTop: units.unit3 }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setStatus('pending')}>
                    <View style={{
                        backgroundColor: (status === 'pending') ? colors.purple4 : null,
                        padding: units.unit4,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: colors.greenD25
                    }}>
                        <Text style={{
                            color: colors.purpleB,
                            fontWeight: (status === 'pending') ? 'bold' : 'normal'
                        }}>
                            PENDING
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setStatus('complete')}>
                    <View style={{
                        backgroundColor: (status === 'complete') ? colors.purple4 : null,
                        padding: units.unit4,
                        flex: 1,
                        alignItems: "center",
                        borderTopWidth: 1,
                        borderTopColor: colors.greenD25,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.greenD25,
                        borderRightWidth: 1,
                        borderRightColor: colors.greenD25
                    }}>
                        <Text style={{
                            color: colors.purpleB,
                            fontWeight: (status === 'complete') ? 'bold' : 'normal'
                        }}>
                            COMPLETE
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const {
            isOpen = false,
            close
        } = this.props;

        const {
            search,
            renderVegetablesSorter,
            sortOrder,
            sortKey
        } = this.state;

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

                        {/* header */}
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

                        {/* tabs */}
                        {this.renderTabs()}

                        {/* search bar */}
                        <View style={{ marginTop: units.unit4 }}>
                            <Input
                                label="Search"
                                onChange={(value) => this.setState({ search: value })}
                                value={search}
                                placeholder="Eggplant"
                            />
                        </View>

                        {/* vegetables */}
                        <View>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: units.unit4, paddingBottom: units.unit4 }}>
                                <Text
                                    className="capitalize"
                                    style={{
                                        fontWeight: 'bold'
                                    }}>
                                    Vegetables
                                </Text>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => this.setState({ renderVegetablesSorter: !renderVegetablesSorter })}>
                                        <Ionicons
                                            name="filter-outline"
                                            size={fonts.h3}
                                            color={colors.purpleB}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {renderVegetablesSorter && (
                                <View style={{ marginBottom: units.unit5 }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', marginBottom: units.unit3 }}>
                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: units.unit3 }}>
                                            <CheckBox
                                                value={sortOrder === 'ascending'}
                                                onValueChange={() => this.setSortOrder('ascending')}
                                                boxType="square"
                                            />
                                            <Text style={{ marginLeft: units.unit3 }}>ASC</Text>
                                        </View>
                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <CheckBox
                                                value={sortOrder === 'descending'}
                                                onValueChange={() => this.setSortOrder('descending')}
                                                boxType="square"
                                            />
                                            <Text style={{ marginLeft: units.unit3 }}>DESC</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Dropdown
                                            label="Sort By"
                                            value={sortKey}
                                            onChange={value => this.setSortKey(value)}
                                            options={[
                                                {
                                                    label: 'Name',
                                                    value: 'name',
                                                },
                                                {
                                                    label: 'Size',
                                                    value: 'quadrant_size',
                                                },
                                            ]}
                                        />
                                    </View>
                                </View>
                            )}
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
        plantSelections: state.plantSelections
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
