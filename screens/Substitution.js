// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, Text, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// UI components
import Header from '../components/UI/Header';
import Dropdown from '../components/UI/Dropdown';
import Button from '../components/UI/Button';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import { alert } from '../components/UI/SystemAlert';

// actions
import { updateUser } from '../actions/user/index';
import { getPlants } from '../actions/plants/index';
import { getBeds, updateBed } from '../actions/beds';
import { updateDraft, getDrafts } from '../actions/drafts';
import { getOrders, getOrder } from '../actions/orders';
import { updateQuote } from '../actions/quotes';

// styles
import units from '../components/styles/units';
import fonts from '../components/styles/fonts';
import colors from '../components/styles/colors';
import card from '../components/styles/card';

// types
import types from '../vars/types';

class Substitution extends Component {

    state = {
        qty: 0,
        plants: [],
        vegetables: [],
        herbs: [],
        fruit: []
    };

    async componentDidMount() {

        // get plants with the same common type and quadrant size
        const plants = await this.props.getPlants(`common_type=${this.props.route.params.selectedPlant.id.common_type._id}&quadrant_size=${this.props.route.params.selectedPlant.id.quadrant_size}`, true);

        let dropdownFormatData = [];
        plants.forEach((plant) => {
            if (`${plant.name} ${plant.common_type.name}` !== `${this.props.route.params.selectedPlant.id.name} ${this.props.route.params.selectedPlant.id.common_type.name}`) {
                dropdownFormatData.push({
                    label: `${plant.name} ${plant.common_type.name}`,
                    value: plant
                })
            }
        })

        // update UI
        this.setState({
            plants: dropdownFormatData
        });
    }

    async confirm() {

        // show loading indicator
        this.setState({ isLoading: true });

        const newPlant = {
            id: this.state.substitutePlant,
            key: this.props.route.params.selectedPlant.key,
            qty: this.props.route.params.selectedPlant.qty
        }

        // substitute plant
        await this.substitutePlant(newPlant);

        // get updated order
        const order = await this.props.getOrder(this.props.route.params.order._id);

        // hide loading indicator
        this.setState({ isLoading: false });

        alert(
            'Your plant has been successfully substituted.',
            'Success!',
            () => {
                // redirect user to order details
                this.props.navigation.navigate('Order Details', order);
            }
        );
    }

    async substitutePlant(substitute) {
        let drafts = this.props.drafts;
        let plantGroupToSubstitute = null;
        let substituted = 0;

        // if initial planting {...}
        if (this.props.route.params.order.type === types.INITIAL_PLANTING) {
            let beds = this.props.beds;
            let bedToUpdate = null;
            beds.forEach((bed) => {
                bed.plot_points.forEach((row) => {
                    row.forEach((column) => {
                        if (column.plant) {
                            const matchingCommonType = column.plant.id.common_type._id === substitute.id.common_type._id;
                            const matchingPlantName = column.plant.id.name === substitute.id.name;
                            if (
                                matchingCommonType &&
                                !matchingPlantName &&
                                (substituted + 1) <= substitute.id.quadrant_size
                            ) {
                                bedToUpdate = bed._id;
                                if (plantGroupToSubstitute) {
                                    if (column.group === plantGroupToSubstitute) {
                                        column.plant = { ...substitute, ...{ dt_planted: new Date() } };
                                        substituted += 1;
                                    }
                                } else {
                                    plantGroupToSubstitute = column.group;
                                    column.plant = { ...substitute, ...{ dt_planted: new Date() } };;
                                    substituted += 1;
                                }
                            }
                        }
                    })
                })
            })

            const bedWithSubstitution = beds.find((bed) => bed._id === bedToUpdate);
            let vegetables = this.props.route.params.order.bid.line_items.vegetables;
            let herbs = this.props.route.params.order.bid.line_items.herbs;
            let fruit = this.props.route.params.order.bid.line_items.fruit;
            const lineItems = this.props.route.params.order.bid.line_items;

            if (substitute.id.category.name === types.VEGETABLE) {
                const updatedVegetables = await this.updateQty(vegetables, substitute);
                lineItems.vegetables = updatedVegetables;
            }

            if (substitute.id.category.name === types.CULINARY_HERB) {
                const updatedHerbs = await this.updateQty(herbs, substitute);
                lineItems.herbs = updatedHerbs;
            }

            if (substitute.id.category.name === types.FRUIT) {
                const updatedFruit = await this.updateQty(fruit, substitute);
                lineItems.fruit = updatedFruit;
            }

            // update bed
            await this.props.updateBed(bedWithSubstitution._id, { plot_points: bedWithSubstitution.plot_points });

            // get updated beds
            await this.props.getBeds(`customer=${this.props.route.params.order.customer._id}`);

            const draftToUpdate = drafts.find((draft) => draft.key === bedWithSubstitution.key);

            // update draft
            await this.props.updateDraft(draftToUpdate._id, { plot_points: bedWithSubstitution.plot_points });

            // get updated drafts
            await this.props.getDrafts(`order=${this.props.route.params.order._id}`);

            // update quote
            await this.props.updateQuote(this.props.route.params.order.bid._id, { line_items: lineItems });
        }

        // else if (this.props.route.params.order.type === types.CROP_ROTATION) { // if crop rotation {...}
        //     let draftToUpdate = null;
        //     drafts.forEach((draft) => {
        //         draft.plot_points.forEach((row) => {
        //             row.forEach((column) => {
        //                 if (column.plant) {
        //                     const matchingCommonType = column.plant.id.common_type._id === substitute.id.common_type._id;
        //                     const matchingPlantName = column.plant.id.name === substitute.id.name;
        //                     if (
        //                         matchingCommonType &&
        //                         !matchingPlantName &&
        //                         (substituted + 1) <= substitute.id.quadrant_size
        //                     ) {
        //                         if (plantGroupToSubstitute) {
        //                             if (column.group === plantGroupToSubstitute) {
        //                                 column.plant = substitute;
        //                                 substituted += 1;
        //                             }
        //                         } else {
        //                             draftToUpdate = draft;
        //                             plantGroupToSubstitute = column.group;
        //                             column.plant = substitute;
        //                             substituted += 1;
        //                         }
        //                     }
        //                 }
        //             })
        //         })
        //     })

        //     if (draftToUpdate) {

        //         // update draft
        //         await this.props.updateDraft(draftToUpdate._id, { plot_points: draftToUpdate.plot_points });
        //     }
        // }

        // if(this.props.route.params.order.type === types.CROP_ROTATION) {
        //     let vegetables = this.props.route.params.order.customer.garden_info.vegetables;
        //     let herbs = this.props.route.params.order.customer.garden_info.herbs;
        //     let fruit = this.props.route.params.order.customer.garden_info.fruit;
        //     const gardenInfo = this.props.route.params.order.customer.garden_info;

        //     if (substitute.id.category.name === types.VEGETABLE) {
        //         const updatedVegetables = await this.updateQty(vegetables, substitute);
        //         gardenInfo.vegetables = updatedVegetables;
        //     }

        //     if (substitute.id.category.name === types.CULINARY_HERB) {
        //         const updatedHerbs = await this.updateQty(herbs, substitute);
        //         gardenInfo.herbs = updatedHerbs;
        //     }

        //     if (substitute.id.category.name === types.FRUIT) {
        //         const updatedFruit = await this.updateQty(fruit, substitute);
        //         gardenInfo.fruit = updatedFruit;
        //     }

        //     // update customer with new garden info
        //     await this.props.updateUser(`userId=${this.props.route.params.order.customer._id}`, { gardenInfo }, true);
        // }

        // get updated orders
        await this.props.getOrders(`status=pending`);
    }

    async updateQty(plants, substitute) {
        const existingMatchingPlantIndex = plants.findIndex((plant) => plant.id._id === substitute.id._id);
        if (existingMatchingPlantIndex >= 0) {
            plants[existingMatchingPlantIndex].qty += 1;
        } else {
            plants.unshift({ id: substitute.id, qty: 1 });
        }

        const plantToReplaceIndex = plants.findIndex((plant) => plant.id._id === this.props.route.params.selectedPlant.id._id);
        if (plantToReplaceIndex >= 0) {
            const newValue = plants[plantToReplaceIndex].qty - 1;
            plants[plantToReplaceIndex].qty = newValue;
            if (newValue === 0) {
                plants.splice(plantToReplaceIndex, 1);
            }
        }

        return plants;
    }

    render() {

        const {
            plants,
            substitutePlant,
            isLoading
        } = this.state;

        const {
            selectedPlant
        } = this.props.route.params;

        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    width: '100%',
                }}>
                <View
                    style={{
                        height: '100%',
                        backgroundColor: colors.greenE10,
                        paddingVertical: units.unit6,
                        paddingHorizontal: units.unit4 + units.unit3,
                        paddingBottom: units.unit6
                    }}>

                    {/* loading indicator (dynamically visible) */}
                    <LoadingIndicator loading={isLoading} />

                    {/* header */}
                    <Header
                        style={{
                            ...fonts.header,
                            paddingTop: units.unit2,
                            paddingBottom: units.unit4,
                        }}>
                        Substitute Plant
                    </Header>

                    {/* selected plant */}
                    <View
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'stretch',
                            flexDirection: 'row',
                            marginBottom: units.unit5,
                        }}>
                        <View style={{ width: '45%' }}>
                            <Text style={{ ...fonts.label }}>Selected Plant</Text>
                            <View
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    ...card,
                                    paddingHorizontal: units.unit4,
                                    flexGrow: 1
                                }}>
                                <Image
                                    style={{
                                        height: units.unit5,
                                        width: units.unit5,
                                        borderRadius: units.unit3,
                                        marginTop: units.unit3
                                    }}
                                    source={{
                                        uri: selectedPlant.id.common_type.image,
                                    }}
                                />
                                <Text style={{
                                    ...fonts.header,
                                    fontSize: fonts.h4,
                                    color: colors.purpleB,
                                    width: '100%',
                                    lineHeight: fonts.h4,
                                    textAlign: 'center'
                                }}>
                                    {selectedPlant ? `${selectedPlant.id.name} ${selectedPlant.id.common_type.name}` : null}
                                </Text>
                                <Text style={{ ...fonts.small, color: colors.greenD50 }}>
                                    {selectedPlant.id.botanical_type.name}
                                </Text>
                            </View>
                        </View>

                        {/* arrow */}
                        <View style={{ marginTop: fonts.h4, display: 'flex', justifyContent: 'center' }}>
                            <Ionicons
                                name="arrow-forward"
                                size={fonts.h1}
                                color={colors.greenA}
                            />
                        </View>

                        {/* new plant */}
                        <View style={{ width: '45%' }}>
                            <Text style={{ ...fonts.label }}>New Plant</Text>
                            <View
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    ...card,
                                    paddingHorizontal: units.unit4,
                                    flexGrow: 1
                                }}>
                                <Image
                                    style={{
                                        height: units.unit5,
                                        width: units.unit5,
                                        borderRadius: units.unit3,
                                        marginTop: units.unit3
                                    }}
                                    source={{
                                        uri: selectedPlant.id.common_type.image,
                                    }}
                                />
                                <Text
                                    style={{
                                        ...fonts.header,
                                        fontSize: fonts.h4,
                                        color: colors.purpleB,
                                        width: '100%',
                                        lineHeight: fonts.h4,
                                        textAlign: 'center'
                                    }}>
                                    {substitutePlant ? `${substitutePlant.name} ${substitutePlant.common_type.name}` : 'Plant Name'}
                                </Text>
                                <Text
                                    style={{
                                        ...fonts.small, color: colors.greenD50
                                    }}>
                                    {substitutePlant ? `${substitutePlant.botanical_type.name}` : 'Botanical Type'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* plant selection */}
                    <Dropdown
                        label="Plants"
                        onChange={value => this.setState({ substitutePlant: value })}
                        options={plants}
                        placeholder="Choose a new varietal"
                    />

                    {/* confirm button */}
                    <Button
                        disabled={!substitutePlant}
                        style={{ marginTop: units.unit4 }}
                        text="Confirm Change"
                        onPress={() => this.confirm()}
                        icon={(
                            <Ionicons
                                name="checkmark"
                                size={units.unit4}
                                color={colors.purpleB}
                            />
                        )}
                    />
                </View>
            </SafeAreaView>
        );

    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        beds: state.beds,
        drafts: state.drafts
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getBeds,
            updateBed,
            updateUser,
            updateDraft,
            getDrafts,
            getOrders,
            getPlants,
            getOrder,
            updateQuote
        },
        dispatch,
    );
}

Substitution = connect(mapStateToProps, mapDispatchToProps)(Substitution);

export default Substitution;

module.exports = Substitution;
