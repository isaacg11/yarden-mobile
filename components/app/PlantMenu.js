import React, { Component } from 'react';
import { View, Modal, Text, TouchableOpacity, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Slider } from '@miblanchard/react-native-slider';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Collapse from '../UI/Collapse';
import Input from '../UI/Input';
import Button from '../UI/Button';
import Link from '../UI/Link';
import Label from '../UI/Label';
import Card from '../UI/Card';
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
        sortKey: 'name',
        menuType: 'grid',
        selectedPlants: []
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

    setBackground(plantType) {
        return colors.white75;
    }

    selectPlant(plant, index) {

        // get selected plants
        let selectedPlants = this.state.selectedPlants;

        // set selected plant
        const selectedPlant = plant;

        // check to see if plant is already selected
        const plantIndex = selectedPlants.findIndex((p) => p.key === (index + 1));

        // if plant has already been selected {...}
        if (plantIndex >= 0) {

            // de-select plant
            selectedPlants.splice(plantIndex, 1);
        } else {

            // if at least 1 plant has been selected {...}
            if (selectedPlants.length > 0) {

                // if the new plant being added is not the same common type as the previous selections {...}
                if (selectedPlants[0].id.common_type._id !== plant.id.common_type._id) {

                    // clear previous selection
                    selectedPlants = [];
                }
            }

            // add plant to list of selected plants
            selectedPlants.push(plant);
        }

        // update UI
        this.setState({
            selectedPlants,
            selectedPlant
        })
    }

    getMenuData() {

        // get menu type
        const menuType = this.state.menuType;

        // group vegetables by common type
        const commonTypeVegetables = separatePlantsByCommonType(this.props.vegetables);
        const commonTypeHerbs = separatePlantsByCommonType(this.props.herbs);
        const commonTypeFruit = separatePlantsByCommonType(this.props.fruit);
        let gridData = [];

        // get current status filter
        const status = this.state.status;

        // iterate through common type groups
        for (let item in commonTypeVegetables) {

            // iterate through each plant in the common type group
            commonTypeVegetables[item].map((vegetable) => {

                // for {x} qty
                for (let i = 0; i < vegetable.qty; i++) {

                    // add new plant
                    gridData.push(vegetable);
                }
            })
        }

        // iterate through common type groups
        for (let item in commonTypeHerbs) {

            // iterate through each plant in the common type group
            commonTypeHerbs[item].map((herb) => {

                // for {x} qty
                for (let i = 0; i < herb.qty; i++) {

                    // add new plant
                    gridData.push(herb);
                }
            })
        }

        // iterate through common type groups
        for (let item in commonTypeFruit) {

            // iterate through each plant in the common type group
            commonTypeFruit[item].map((fruit) => {

                // for {x} qty
                for (let i = 0; i < fruit.qty; i++) {

                    // add new plant
                    gridData.push(fruit);
                }
            })
        }

        // set initial data value
        let data = null;

        // if menu type is "grid" {...}
        if (menuType === 'grid') {

            return gridData;

            // set items per row 
            // const columnWidth = 4

            // // set rows
            // data = gridData.reduce((resultArray, item, index) => {
            //     const rowIndex = Math.floor(index / columnWidth)

            //     if (!resultArray[rowIndex]) {
            //         resultArray[rowIndex] = [] // start a new row
            //     }

            //     // get plants for category
            //     const categorySelection = this.props.plantSelections[`${item.id.category.name}${item.id.category.name !== 'fruit' ? 's' : ''}`];

            //     // check to see if item has been planted
            //     const planted = categorySelection.find((selection) => selection.key === (index + 1));

            //     let renderItem = true;

            //     if (planted) {
            //         if (status === 'pending') {
            //             renderItem = false;
            //         } else if (status === 'complete') {
            //             renderItem = true;
            //         }
            //     } else {
            //         if (status === 'pending') {
            //             renderItem = true;
            //         } else if (status === 'complete') {
            //             renderItem = false;
            //         }
            //     }


            //     const plant = (renderItem) ? item : {
            //         isEmpty: true,
            //         isPlanted: planted
            //     };

            //     resultArray[rowIndex].push({
            //         ...plant,
            //         ...{ key: index + 1 }
            //     });

            //     if (resultArray[rowIndex].length < columnWidth) {
            //         if (index === gridData.length - 1) {
            //             let diff = (columnWidth - resultArray[rowIndex].length);
            //             for (let i = 0; i < diff; i++) {
            //                 resultArray[rowIndex].push({ isEmpty: true });
            //             }
            //         }
            //     }

            //     return resultArray
            // }, []);
        } else if (menuType === 'list') { // if menu type is "list" {...}

            // set initial list data
            let listData = [];

            // iterate through grid data
            gridData.forEach((item, index) => {
                listData.push({
                    ...item,
                    ...{ key: index + 1 }
                });
            })

            data = listData;
        }

        return data;
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
                                style={{ width: 25, height: 25 }}
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

    renderHeader() {
        return (
            <View style={{
                paddingHorizontal: units.unit4,
                marginTop: units.unit6,
                marginBottom: units.unit3,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link
                    onPress={() => this.props.close()}
                    icon={
                        <Ionicons
                            name="chevron-back"
                            size={fonts.h3}
                            color={colors.purpleB}
                        />
                    }
                    text={'Back'}
                />
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => this.setState({ menuType: 'grid' })}
                        style={{
                            borderRadius: 5,
                            marginRight: units.unit2,
                            backgroundColor: (this.state.menuType === 'grid') ? colors.purple4 : colors.white,
                            padding: units.unit3
                        }}>
                        <Ionicons
                            name="grid-outline"
                            size={fonts.h2}
                            color={colors.purpleB}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.setState({ menuType: 'list' })}
                        style={{
                            borderRadius: 5,
                            backgroundColor: (this.state.menuType === 'list') ? colors.purple4 : colors.white,
                            padding: units.unit3
                        }}>
                        <Ionicons
                            name="search"
                            size={fonts.h2}
                            color={colors.purpleB}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderTabs() {

        // get status filter
        const status = this.state.status;

        // set initial total plants value
        let totalPlants = 0;

        // calculate total plants
        this.props.vegetables.forEach((vegetable) => totalPlants += vegetable.qty);
        this.props.herbs.forEach((herb) => totalPlants += herb.qty);
        this.props.fruit.forEach((fr) => totalPlants += fr.qty);

        // get complete plants value
        let completePlants = this.props.plantSelections['vegetables'].length + this.props.plantSelections['herbs'].length + this.props.plantSelections['fruit'].length;

        // get pending plants
        const pendingPlants = totalPlants - completePlants;

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
                            PENDING ({pendingPlants})
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
                            COMPLETE ({completePlants})
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderGridMenu() {

        // get status filter
        const status = this.state.status;

        // get rows
        const rows = this.getMenuData();

        return (
            <View style={{ backgroundColor: colors.greenE10 }}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    width: '100%',
                }}>

                    {/* columns */}
                    {rows.map((column, index) => {
                        if (status === 'pending' && !column.isEmpty) {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={{
                                        background: 'red',
                                        flexBasis: '25%',
                                        padding: units.unit2
                                    }}
                                    onPress={() => this.selectPlant(column, index)}>
                                    <View
                                        style={{
                                            backgroundColor: colors.white75,
                                            borderRadius: units.unit3,
                                            height: units.unit6 + units.unit4,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'relative'
                                        }}>
                                        {(!column.isEmpty) && (
                                            <View style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '100%',
                                                height: '100%',
                                                position: 'relative'
                                            }}>
                                                <Image
                                                    source={{ uri: column.id.common_type.image }}
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
                                                    <SizeIndicator size={column.id.quadrant_size} />
                                                </View>
                                                {(this.state.selectedPlants.find((p, i) => i === index)) && (
                                                    <View
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: units.unit2,
                                                            paddingRight: units.unit2,
                                                            paddingTop: units.unit2,
                                                        }}>
                                                        <View style={{ backgroundColor: colors.purple1, borderRadius: 25 }}>
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
                                        {(column.isPlanted && status === 'pending') && (
                                            <Ionicons
                                                name="checkmark"
                                                size={fonts.h1}
                                                color={colors.white}
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            )
                        }

                    })}
                </View>
            </View>
        )
    }

    renderListMenu() {

        // get rows
        const listItems = this.getMenuData();

        return (
            <View style={{ marginTop: units.unit2, backgroundColor: colors.greenE10 }}>
                {(listItems.map((li, index) => {

                    // get plants for category
                    const categorySelection = this.props.plantSelections[`${li.id.category.name}${li.id.category.name !== 'fruit' ? 's' : ''}`];

                    // check to see if item has been planted
                    const planted = categorySelection.find((selection) => selection.key === (index + 1));

                    return (
                        <View key={index} style={{ paddingHorizontal: units.unit3, paddingVertical: units.unit2 }}>
                            <TouchableOpacity onPress={() => {
                                if (!planted) {
                                    this.selectPlant(li)
                                }
                            }}>
                                <Card style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        {(this.state.selectedPlants.find((p) => p.key === li.key)) ? (
                                            <View style={{ backgroundColor: colors.purple1, borderRadius: 25 }}>
                                                <Ionicons
                                                    name="checkmark"
                                                    size={fonts.h3}
                                                    color={colors.white}
                                                />
                                            </View>
                                        ) :
                                            (
                                                <Ionicons
                                                    name={(this.state.status === 'pending' && !planted) ? "ellipse-outline" : "checkmark-done"}
                                                    size={fonts.h3}
                                                    color={(planted) ? colors.greenB : colors.purpleB}
                                                />
                                            )}
                                        <Image
                                            source={{ uri: li.id.common_type.image }}
                                            style={{
                                                height: units.unit5,
                                                width: units.unit5,
                                                marginRight: units.unit3,
                                                marginLeft: units.unit4
                                            }}
                                        />
                                        <View>
                                            <Text>{li.id.name} {li.id.common_type.name}</Text>
                                            <Text style={{ ...fonts.label, color: (planted) ? colors.greenE25 : colors.greenB }}>{planted ? 'Planted' : 'Pending'}</Text>
                                        </View>
                                    </View>
                                    <SizeIndicator size={li.id.quadrant_size} />
                                </Card>
                            </TouchableOpacity>
                        </View>
                    )
                }))}
            </View>
        )
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
        return (
            <View style={{
                borderTopWidth: 1,
                borderTopColor: colors.purpleB,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: units.unit4
            }}>
                <Button
                    text="Add Plants"
                    style={{ width: '100%' }}
                    onPress={() => {
                        const selections = this.state.selectedPlants;
                        const plant = this.state.selectedPlant;
                        const additionalQty = this.state.selectedPlants.length;
                        if (additionalQty > 0) {

                            // add plant
                            this.props.addPlant({
                                plant,
                                additionalQty,
                                selections
                            });

                            this.setState({
                                selectedPlants: []
                            })

                            // close modal
                            this.props.close();
                        }
                    }}
                />
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
                    <View style={{ height: '95%' }}>

                        {/* header */}
                        {this.renderHeader()}

                        {/* search */}
                        {(this.state.menuType === 'list') && (
                            <View style={{ paddingHorizontal: units.unit3 }}>
                                <Input value={""} placeholder="Search..." />
                            </View>
                        )}

                        {/* tabs */}
                        {(this.state.menuType === 'grid') && this.renderTabs()}

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
