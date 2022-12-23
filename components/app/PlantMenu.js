// libraries
import React, { Component } from 'react';
import { View, Modal, Text, TouchableOpacity, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

// UI components
import Input from '../UI/Input';
import Button from '../UI/Button';
import Link from '../UI/Link';
import Card from '../UI/Card';
import SizeIndicator from '../UI/SizeIndicator';

// helpers
import getPlantedList from '../../helpers/getPlantedList';
import formatMenuData from '../../helpers/formatMenuData';

// styles
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
        let selectedPlant = plant;

        // check to see if plant is already selected
        const plantIndex = selectedPlants.findIndex((p) => p.key === (index + 1));

        // if plant has already been selected {...}
        if (plantIndex >= 0) {

            // de-select plant
            selectedPlants.splice(plantIndex, 1);
            selectedPlant = null;
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

    searchPlants(value) {
        this.setState({ search: value });
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
        let completePlants = 0;

        // get pending plants
        let pendingPlants = 0;

        const rows = formatMenuData(this.props.vegetables, this.props.herbs, this.props.fruit);
        const planted = getPlantedList(this.props.drafts);

        // if drafts exist {...}
        if(this.props.drafts.length > 0) {
            rows.forEach((column) => {
                // check drafts for plant
                const plantIsSaved = (planted.find((plant) => plant.key === column.key));
                
                // if plant is saved {...}
                if(plantIsSaved) {
                    completePlants += 1;
                } else {
                    pendingPlants += 1;
                }
            })
        } else {
            pendingPlants = totalPlants;
        }

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
        const rows = formatMenuData(this.props.vegetables, this.props.herbs, this.props.fruit);
        const planted = getPlantedList(this.props.drafts);

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

                        // check drafts for plant
                        const plantIsSaved = (planted.find((plant) => plant.key === column.key));

                        if (status === 'pending' && !plantIsSaved) {
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
                                                {(this.state.selectedPlants.find((p, i) => p.key === (index + 1))) && (
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
                        } else if (status === 'complete' && plantIsSaved) {
                            return (
                                <View
                                    key={index}
                                    style={{
                                        background: 'red',
                                        flexBasis: '25%',
                                        padding: units.unit2
                                    }}>
                                    <View
                                        style={{
                                            backgroundColor: colors.white75,
                                            borderRadius: units.unit3,
                                            height: units.unit6 + units.unit4,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'relative'
                                        }}>
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
                                        </View>
                                    </View>
                                </View>
                            )
                        }
                    })}
                </View>
            </View>
        )
    }

    renderListMenu() {

        const listItems = formatMenuData(this.props.vegetables, this.props.herbs, this.props.fruit, this.state.search);
        const currentPlants = getPlantedList(this.props.drafts);

        return (
            <View style={{ marginTop: units.unit2, backgroundColor: colors.greenE10 }}>
                {(listItems.map((li, index) => {

                    // check to see if item has been planted
                    const planted = currentPlants.find((plant) => plant.key === li.key);

                    return (
                        <View key={index} style={{ paddingHorizontal: units.unit3, paddingVertical: units.unit2 }}>
                            <TouchableOpacity onPress={() => {
                                if (!planted) {
                                    this.selectPlant(li, index)
                                }
                            }}>
                                <Card style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        {(this.state.selectedPlants.find((p) => p.key === (index + 1))) ? (
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
                                                    name={(!planted) ? "ellipse-outline" : "checkmark-done"}
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
        if(this.state.status === 'pending') {
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
                        disabled={!this.state.selectedPlant}
                        text="Add Plants"
                        style={{ width: '100%' }}
                        onPress={() => {
                            if (this.state.selectedPlants.length > 0) {
    
                                // add plant
                                this.props.addPlant({
                                    plant: this.state.selectedPlant,
                                    selectedPlants: this.state.selectedPlants
                                });
    
                                // clear selections
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

        
    }

    renderSearchBar() {
        return (
            <View style={{ paddingHorizontal: units.unit3 }}>
                <Input
                    onChange={(value) => this.searchPlants(value)}
                    value={this.state.search}
                    placeholder="Search..."
                />
            </View>
        )
    }

    render() {
        const {
            isOpen = false
        } = this.props;

        return (
            <View>
                <Modal
                    animationType="slide"
                    visible={isOpen}
                    presentationStyle="fullScreen">
                    <View style={{ height: '95%' }}>

                        {/* header */}
                        {this.renderHeader()}

                        {/* search bar (dynamically visible) */}
                        {(this.state.menuType === 'list') && this.renderSearchBar()}

                        {/* tabs (dynamically visible) */}
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
        drafts: state.drafts
    };
}

PlantMenu = connect(mapStateToProps, null)(PlantMenu);

export default PlantMenu;

module.exports = PlantMenu;
