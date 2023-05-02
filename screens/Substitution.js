// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// UI components
import Header from '../components/UI/Header';
import Dropdown from '../components/UI/Dropdown';
import Button from '../components/UI/Button';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Link from '../components/UI/Link';
import Input from '../components/UI/Input';
import { alert } from '../components/UI/SystemAlert';

// actions
import { updateUser } from '../actions/user/index';
import { getPlants } from '../actions/plants/index';
import { getBeds, updateBed } from '../actions/beds';
import { updateDraft, getDrafts } from '../actions/drafts';
import { getOrders, getOrder } from '../actions/orders';
import { updateQuote } from '../actions/quotes';
import { createPlant } from '../actions/plants';
import { sendEmail } from '../actions/emails/index';
import { getPlantList, updatePlantList } from '../actions/plantList/index';

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
        fruit: [],
        varietalName: ''
    };

    componentDidMount() {
        this.setPlantList();
    }

    async setPlantList() {
        // get plants with the same common type and quadrant size
        const plants = await this.props.getPlants(`common_type=${this.props.route.params.selectedPlant.id.common_type._id}&quadrant_size=${this.props.route.params.selectedPlant.id.quadrant_size}`, true);

        // format data for dropdown list
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

    async getBedWithSubstitution(substitute) {
        let beds = this.props.beds;
        let plantGroupToSubstitute = null;
        let substituted = 0;
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
        return bedWithSubstitution;
    }

    async substitutePlant(substitute) {

        // get bed with substitution
        const bedWithSubstitution = await this.getBedWithSubstitution(substitute);

        // if initial planting {...}
        if (this.props.route.params.order.type === types.INITIAL_PLANTING) {

            let vegetables = this.props.plantList.vegetables;
            let herbs = this.props.plantList.herbs;
            let fruit = this.props.plantList.fruit;
            const lineItems = this.props.route.params.order.bid.line_items;

            if (substitute.id.category.name === types.VEGETABLE) {

                // set qty based on selection
                const updatedVegetables = await this.updateQty(vegetables, substitute);

                // update plant list
                await this.props.updatePlantList(this.props.plantList._id, { vegetables: updatedVegetables });

                // get plant list
                await this.props.getPlantList(`order=${this.props.route.params.order._id}`);

                lineItems.vegetables = updatedVegetables;
            }

            if (substitute.id.category.name === types.CULINARY_HERB) {
                
                // set qty based on selection
                const updatedHerbs = await this.updateQty(herbs, substitute);

                // update plant list
                await this.props.updatePlantList(this.props.plantList._id, { herbs: updatedHerbs });

                // get plant list
                await this.props.getPlantList(`order=${this.props.route.params.order._id}`);

                lineItems.herbs = updatedHerbs;
            }

            if (substitute.id.category.name === types.FRUIT) {

                // set qty based on selection
                const updatedFruit = await this.updateQty(fruit, substitute);

                // update plant list
                await this.props.updatePlantList(this.props.plantList._id, { fruit: updatedFruit });

                // get plant list
                await this.props.getPlantList(`order=${this.props.route.params.order._id}`);

                lineItems.fruit = updatedFruit;
            }

            // update bed
            await this.props.updateBed(bedWithSubstitution._id, { plot_points: bedWithSubstitution.plot_points });

            // get updated beds
            await this.props.getBeds(`customer=${this.props.route.params.order.customer._id}`);

            // get draft to update
            const draftToUpdate = this.props.drafts.find((draft) => draft.key === bedWithSubstitution.key);

            // update draft
            await this.props.updateDraft(draftToUpdate._id, { plot_points: bedWithSubstitution.plot_points });

            // get updated drafts
            await this.props.getDrafts(`order=${this.props.route.params.order._id}`);

            // update quote
            await this.props.updateQuote(this.props.route.params.order.bid._id, { line_items: lineItems });

        } else if (this.props.route.params.order.type === types.CROP_ROTATION) { // if crop rotation {...}
            let vegetables = this.props.route.params.order.customer.garden_info.vegetables;
            let herbs = this.props.route.params.order.customer.garden_info.herbs;
            let fruit = this.props.route.params.order.customer.garden_info.fruit;
            let gardenInfo = this.props.route.params.order.customer.garden_info;
            gardenInfo.beds.forEach((bed) => {
                bed.shape = bed.shape._id;
            })

            if (substitute.id.category.name === types.VEGETABLE) {
                const updatedVegetables = await this.updateQty(vegetables, substitute);
                gardenInfo.vegetables = updatedVegetables;
            }

            if (substitute.id.category.name === types.CULINARY_HERB) {
                const updatedHerbs = await this.updateQty(herbs, substitute);
                gardenInfo.herbs = updatedHerbs;
            }

            if (substitute.id.category.name === types.FRUIT) {
                const updatedFruit = await this.updateQty(fruit, substitute);
                gardenInfo.fruit = updatedFruit;
            }

            // update bed
            await this.props.updateBed(bedWithSubstitution._id, { plot_points: bedWithSubstitution.plot_points });

            // get updated beds
            await this.props.getBeds(`customer=${this.props.route.params.order.customer._id}`);

            // update customer with new garden info
            await this.props.updateUser(`userId=${this.props.route.params.order.customer._id}`, { gardenInfo }, true);
        }

        // get updated orders
        await this.props.getOrders(`status=pending`);
    }

    async updateQty(plants, substitute) {
        const existingMatchingPlantIndex = plants.findIndex((plant) => plant.id._id === substitute.id._id);
        if (existingMatchingPlantIndex >= 0) {
            plants[existingMatchingPlantIndex].qty += 1;
        } else {
            plants.unshift({
                id: substitute.id, 
                qty: 1,
                completed: 0
            });
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

    async createVarietal() {

        // if no plant name {...}
        if (!this.state.varietalName) {

            // show warning
            alert(
                'Please enter a varietal name',
                'Uh Oh!'
            );
        } else {

            // show loading indicator
            this.setState({ isLoading: true });

            // set selected plant data as the base of new varietal (new varietal will be reviewed by HQ and adjusted as needed after creation)
            const similarVarietal = this.props.route.params.selectedPlant.id;

            // set new varietal
            const newVarietal = {
                average_head_weight: similarVarietal.average_head_weight,
                average_produce_weight: similarVarietal.average_produce_weight,
                botanical_type: similarVarietal.botanical_type._id,
                category: similarVarietal.category._id,
                common_type: similarVarietal.common_type._id,
                days_to_mature: similarVarietal.days_to_mature,
                edible: similarVarietal.edible,
                family_type: similarVarietal.family_type._id,
                growth_style: similarVarietal.growth_style._id,
                image: 'https://yarden-garden.s3.us-west-1.amazonaws.com/plant-images/placeholder.png',
                name: this.state.varietalName.trim(),
                partial_sun: similarVarietal.partial_sun,
                produce_type: similarVarietal.produce_type._id,
                quadrant_size: similarVarietal.quadrant_size,
                season: similarVarietal.season
            }

            // create plant
            const varietal = await this.props.createPlant(newVarietal);

            // set plant list
            await this.setPlantList();

            // update UI
            this.setState({
                isLoading: false,
                varietalName: '',
                isEditingName: false,
            });

            // format email
            const newBedsRequest = {
                email: 'isaac.grey@yardengarden.com',
                subject: `Yarden - (ACTION REQUIRED) New plant added`,
                label: 'New Varietal',
                body: (
                    '<p>Hello <b>Yarden HQ</b>,</p>' +
                    '<p style="margin-bottom: 15px;">A new plant varietal has been created by <u>' + this.props.user.email + '</u>, please review and update as needed.</p>' +
                    '<p><b>New Plant</b></p>' +
                    '<p>' + '"' + `${varietal.name} ${similarVarietal.common_type.name}` + '"' + '</p>'
                )
            }

            // send email
            await this.props.sendEmail(newBedsRequest);

            // show success message
            alert(
                'The new varietal has been added to the plant list',
                'Success!'
            );
        }
    }

    render() {

        const {
            plants,
            substitutePlant,
            isLoading,
            varietalName,
            isEditingName
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
                <KeyboardAvoidingView
                    behavior="padding"
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

                    {/* new varietal */}

                    {(!isEditingName) && (
                        <View>
                            <View style={{ marginTop: units.unit6, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                <Text>Don't see the varietal you need?</Text>
                            </View>
                            <View style={{ marginTop: units.unit4, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                <Link
                                    icon={
                                        <Ionicons
                                            name="add-outline"
                                            size={fonts.h3}
                                            color={colors.purpleB}
                                        />
                                    }
                                    text={'Add New Varietal'}
                                    onPress={() => this.setState({ isEditingName: true })}
                                />
                            </View>
                        </View>
                    )}
                    {(isEditingName) && (
                        <View>
                            <View style={{ marginTop: units.unit6, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                <Text>Enter the varietal name. For example, if you are adding "Sweet Corn", only enter "Sweet".</Text>
                            </View>
                            <Input
                                onChange={value => this.setState({ varietalName: value })}
                                value={varietalName}
                                placeholder="Varietal Name"
                            />
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    marginBottom: units.unit3,
                                }}>
                                <TouchableOpacity
                                    onPress={() => this.createVarietal()}>
                                    <Ionicons
                                        name={'checkmark'}
                                        color={colors.purple0}
                                        size={fonts.h2}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.setState({ isEditingName: false })}>
                                    <Ionicons
                                        name={'close'}
                                        color={colors.purple0}
                                        size={fonts.h2}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </KeyboardAvoidingView>
            </SafeAreaView>
        );

    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        beds: state.beds,
        drafts: state.drafts,
        plantList: state.plantList
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
            updateQuote,
            createPlant,
            sendEmail,
            updatePlantList,
            getPlantList
        },
        dispatch,
    );
}

Substitution = connect(mapStateToProps, mapDispatchToProps)(Substitution);

export default Substitution;

module.exports = Substitution;
