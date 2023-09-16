// libraries
import React, { Component } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Header from '../components/UI/Header';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import PlantAvailability from '../components/app/PlantAvailability';
import { alert } from '../components/UI/SystemAlert';

// actions
import { getGardens } from '../actions/gardens/index';
import { getPlants } from '../actions/plants/index';

// helpers
import getSeason from '../helpers/getSeason';
import calculateTotalFeet from '../helpers/calculateTotalFeet';
import setPlants from '../helpers/setPlants';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';

class PlantSelectionType extends Component {

    state = {
        gardens: [],
        isLoading: true
    }

    async componentDidMount() {
        
        const season = getSeason();
        // const season = 'spring';

        // get signature gardens
        const gardens = await this.props.getGardens(`season=${season}`);

        // get all plants associated with the current season
        await this.props.getPlants(`season=${season}`);

        // update UI
        this.setState({
            gardens: gardens,
            isLoading: false
        })
    }

    async next(garden) {
        const { line_items, isCropRotation, title } = this.props.route.params;
        let selectedPlants = [];
        let generatedResults = [];
        let beds = [];

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
        let plantsSqft = 0;

        // NOTE: Added buffer (10%) to allow room for different sizes. Do not remove!
        // Author - Isaac G. 8/19/23
        const buffer = parseInt((measurements.sqft * 0.1).toFixed(0));
        let bedSqft = measurements.sqft - buffer;

        // set plant for each common type selected
        garden.vegetables.forEach((vegetable) => {
            const p = this.props.plants.find((plant) => plant.common_type._id === vegetable._id);
            if (p) {
                if (!selectedPlants.find((selectedPlants) => selectedPlants.common_type._id === vegetable._id)) {
                    selectedPlants.push(p);
                }
            }
        })
        garden.herbs.forEach((herb) => {
            const p = this.props.plants.find((plant) => plant.common_type._id === herb._id);
            if (p) {
                if (!selectedPlants.find((selectedPlants) => selectedPlants.common_type._id === herb._id)) {
                    selectedPlants.push(p);
                }
            }
        })
        garden.fruit.forEach((fr) => {
            const p = this.props.plants.find((plant) => plant.common_type._id === fr._id);
            if (p) {
                if (!selectedPlants.find((selectedPlants) => selectedPlants.common_type._id === fr._id)) {
                    selectedPlants.push(p);
                }
            }
        })

        // calculate total sqft of selected plants
        selectedPlants.forEach((p) => {
            const { quadrant_size } = p;
            const sqft = quadrant_size / 4;
            plantsSqft += sqft;
        })

        // if space available is less than sqft of plants selected, show warning
        if (plantsSqft > bedSqft) {
            return alert(
                `The garden you selected has ${plantsSqft.toFixed(0)} sqft of plants, but your available space is only ${bedSqft.toFixed(0)} sqft. Please select "Build Your Own" to continue.`,
            )
        }

        // if plants selected do not fill up the entire bed, auto generate plants to fill up bed
        while (bedSqft > 0) {
            for (let i = 0; i < selectedPlants.length; i++) {
                const p = selectedPlants[i];
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

        // set garden plants
        const plantSelection = generatedResults;
        const plants = await setPlants(plantSelection);
        const vegetables = plants.vegetables;
        const fruit = plants.fruit;
        const herbs = plants.herbs;

        // combine quote and plants
        let quoteAndPlants = {
            ...{ vegetables, herbs, fruit },
            ...{ quoteTitle: title },
        };

        // combine params
        const params = {
            ...this.props.route.params,
            ...{ plantSelections: [quoteAndPlants], isCheckout: true },
            ...{ garden }
        };

        // navigate user to Confirm Plants screen
        this.props.navigation.navigate('Confirm Plants', params);
    }

    render() {

        const {
            gardens,
            isLoading
        } = this.state;

        if (isLoading) {
            return (<LoadingIndicator loading={true} />)
        } else {
            return (
                <SafeAreaView
                    style={{
                        flex: 1,
                        width: '100%',
                    }}>
                    {/* loading indicator */}
                    <LoadingIndicator loading={isLoading} />

                    <ScrollView>
                        <View style={{ padding: units.unit3 + units.unit4 }}>

                            {/* header */}
                            <Header type="h5">
                                Selections
                            </Header>
                            <Text>
                                Choose a pre-selected garden or build your own
                            </Text>

                            {/* Yarden signature gardens */}
                            <View style={{ height: '100%', marginTop: units.unit3 }}>
                                {gardens.map((garden, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={{
                                            borderBottomColor: colors.greenD25,
                                            borderBottomWidth: 1,
                                            paddingVertical: units.unit4,
                                            paddingHorizontal: units.unit4,
                                        }}
                                        onPress={() => this.next(garden)}>
                                        <View style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: units.unit3,
                                        }}>
                                            <View style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                gap: units.unit3,
                                                alignItems: 'center'
                                            }}>
                                                <View style={{
                                                    width: units.unit6,
                                                    height: units.unit6,
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Image
                                                        source={{
                                                            uri: garden.image,
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: units.unit3
                                                        }}
                                                    />
                                                </View>
                                                <View style={{ width: '67%', marginLeft: units.unit4 }}>
                                                    <Header type="h6">
                                                        {garden.name}
                                                    </Header>
                                                    <Text style={{ maxWidth: '100%' }}>
                                                        {garden.description}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Ionicons
                                                    name="chevron-forward"
                                                    size={fonts.h3}
                                                    color={colors.purpleB}
                                                />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}

                                {/* Build your own */}
                                <TouchableOpacity
                                    style={{
                                        borderBottomColor: colors.greenD25,
                                        borderBottomWidth: 1,
                                        paddingVertical: units.unit4,
                                        paddingHorizontal: units.unit4,
                                    }}
                                    onPress={() => this.props.navigation.navigate('Garden', this.props.route.params)}>
                                    <View style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: units.unit3,
                                    }}>
                                        <View style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: units.unit3,
                                            alignItems: 'center'
                                        }}>
                                            <View style={{
                                                width: units.unit6,
                                                height: units.unit6,
                                                display: 'flex',
                                                justifyContent: 'center'
                                            }}>
                                                <Image
                                                    source={{
                                                        uri: 'https://yarden-garden.s3.us-west-1.amazonaws.com/static+assets/ai-basket-of-harvest.png',
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        borderRadius: units.unit3
                                                    }}
                                                />
                                            </View>
                                            <View style={{ width: '67%', marginLeft: units.unit4 }}>
                                                <Header type="h6">
                                                    Build Your Own
                                                </Header>
                                                <Text style={{ maxWidth: '100%' }}>
                                                    Select the type of plants you want grown in your garden
                                                </Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Ionicons
                                                name="chevron-forward"
                                                size={fonts.h3}
                                                color={colors.purpleB}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                {/* NOTE: temporarily commenting out code until Spring crop rotation 2024. Do not remove!
                                AUTHOR: Isaac G. 8/23/23 */}

                                {/* Use last seasons selection */}
                                {/* <TouchableOpacity>
                                    <View style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingVertical: units.unit4,
                                        paddingHorizontal: units.unit4,
                                        borderBottomColor: colors.greenD25,
                                        borderBottomWidth: 1
                                    }}>
                                        <View style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: units.unit3
                                        }}>
                                            <View style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}>
                                                <Ionicons
                                                    name="refresh-outline"
                                                    size={fonts.h3}
                                                    color={colors.purpleB}
                                                />
                                            </View>
                                            <View style={{ marginLeft: units.unit3 }}>
                                                <Text>
                                                    Use your last seasons selection
                                                </Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Ionicons
                                                name="chevron-forward"
                                                size={fonts.h3}
                                                color={colors.purpleB}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity> */}

                                {/* plant availability */}
                                <View style={{ marginTop: units.unit4 }}>
                                    <PlantAvailability />
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
        beds: state.beds
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getGardens,
            getPlants
        },
        dispatch,
    );
}


PlantSelectionType = connect(mapStateToProps, mapDispatchToProps)(PlantSelectionType);

export default PlantSelectionType;

module.exports = PlantSelectionType;
