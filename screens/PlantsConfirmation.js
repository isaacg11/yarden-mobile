// libraries
import React, { Component } from 'react';
import { SafeAreaView, ScrollView, View, Image, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// UI components
import Header from '../components/UI/Header';
import Button from '../components/UI/Button';
import Paragraph from '../components/UI/Paragraph';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Input from '../components/UI/Input';

// helpers
import truncate from '../helpers/truncate';
import getSeason from '../helpers/getSeason';
import combinePlants from '../helpers/combinePlants';

// actions
import { createPlantList, getPlantList } from '../actions/plantList/index';
import { createSpecialRequest } from '../actions/specialRequests';

// styles
import units from '../components/styles/units';

class PlantsConfirmation extends Component {

    state = {}

    next() {
        const params = this.props.route.params;
        const { user, navigation } = this.props;
        const { specialRequest } = this.state;
        const data = (specialRequest) ? { specialRequest } : {};

        // if crop rotation {...}
        if (params.isCropRotation) {

            // show loading indicator
            this.setState({ isLoading: true }, async () => {

                // set garden plants
                const plants = params.plantSelections[0];
                const vegetables = plants.vegetables;
                const fruit = plants.fruit;
                const herbs = plants.herbs;

                // combine plants from selection
                const combinedPlants = combinePlants([{ vegetables, herbs, fruit }]);

                // format vegetables for plant list
                const v = combinedPlants.vegetables.map((vegetable) => {
                    return {
                        id: vegetable.id,
                        qty: vegetable.qty,
                        completed: 0
                    }
                })

                // format herbs for plant list
                const h = combinedPlants.herbs.map((herb) => {
                    return {
                        id: herb.id,
                        qty: herb.qty,
                        completed: 0
                    }
                })

                // format fruit for plant list
                const f = combinedPlants.fruit.map((fr) => {
                    return {
                        id: fr.id,
                        qty: fr.qty,
                        completed: 0
                    }
                })

                // create plant list
                await this.props.createPlantList({
                    order: params.order._id,
                    vegetables: v,
                    herbs: h,
                    fruit: f
                })

                // set new plant list on global state, which is used to determine if a CR selection has been made or not
                await this.props.getPlantList(`order=${params.order._id}`);

                if(specialRequest) {

                    // create a special request for this order
                    await this.props.createSpecialRequest({
                        order: params.order._id,
                        description: specialRequest
                    })
                }
                
                // hide loading indicator
                this.setState({ isLoading: false });

                // navigate to plants selected confirmation
                navigation.navigate('Plants Selected');
            })
        } else if (
            user.garden_info?.maintenance_plan &&
            user.garden_info?.maintenance_plan !== 'none') { // if user already has maintenance plan selected {...}
            // navigate to checkout
            navigation.navigate('Checkout', {...params, ...data});
        } else {
            // navigate to plan enrollment
            navigation.navigate('Enrollment', {...params, ...data});
        }
    }

    render() {
        const params = this.props.route.params;
        const { garden, isCropRotation } = params;
        const { isLoading, specialRequest } = this.state;

        if (isLoading) {
            return (<LoadingIndicator loading={true} />);
        } else {
            return (
                <SafeAreaView style={{
                    flex: 1,
                    width: "100%",
                }}>
                    <ScrollView style={{ padding: units.unit3 + units.unit4 }}>

                        {/* header */}
                        <Header type="h5">
                            {garden.name} ({getSeason()} Season)
                        </Header>
                        <Text>
                            Please review your selection and tap "Next" to continue
                        </Text>

                        {/* plant list */}
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: units.unit3 }}>
                            <View>
                                <Paragraph style={{ marginTop: units.unit4 }}>
                                    Vegetables
                                </Paragraph>
                                {garden.vegetables.length > 0 ? garden.vegetables.map((vegetable, index) => (
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: units.unit3 }} key={index}>
                                        <Image
                                            source={{ uri: vegetable.image }}
                                            style={{ width: 32, height: 32, marginRight: units.unit3 }}
                                        />
                                        <Text>{truncate(vegetable.name, 10)}</Text>
                                    </View>
                                )) : (
                                    <Text style={{ marginTop: units.unit3 }}>None</Text>
                                )}
                            </View>
                            <View>
                                <Paragraph style={{ marginTop: units.unit4 }}>
                                    Herbs
                                </Paragraph>
                                {garden.herbs.length > 0 ? garden.herbs.map((herb, index) => (
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: units.unit3 }} key={index}>
                                        <Image
                                            source={{ uri: herb.image }}
                                            style={{ width: 32, height: 32, marginRight: units.unit3 }}
                                        />
                                        <Text>{truncate(herb.name, 10)}</Text>
                                    </View>
                                )) : (
                                    <Text style={{ marginTop: units.unit3 }}>None</Text>
                                )}
                            </View>
                            <View>
                                <Paragraph style={{ marginTop: units.unit4 }}>
                                    Fruit
                                </Paragraph>
                                {garden.fruit.length > 0 ? garden.fruit.map((fr, index) => (
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: units.unit3 }} key={index}>
                                        <Image
                                            source={{ uri: fr.image }}
                                            style={{ width: 32, height: 32, marginRight: units.unit3 }}
                                        />
                                        <Text>{truncate(fr.name, 10)}</Text>
                                    </View>
                                )) : (
                                    <Text style={{ marginTop: units.unit3 }}>None</Text>
                                )}
                            </View>
                        </View>

                        {/* special requests */}
                        <View style={{ marginTop: units.unit4}}>
                            <Header type="h6">Note to gardener</Header>
                            <Text>Have any special requests? Let your gardener know here.</Text>
                            <Input
                                multiline
                                numberOfLines={5}
                                onChange={(value) => this.setState({ specialRequest: value })}
                                value={specialRequest}
                                placeholder="Example: I want roma tomatoes and iceberg lettuce..."
                            />
                        </View>

                        {/* button */}
                        <View style={{ marginTop: units.unit4, marginBottom: units.unit6 }}>
                            <Button
                                text={(isCropRotation) ? 'Finish' : 'Next'}
                                onPress={() => this.next()}
                                variant="primary"
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            )
        }
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
            createPlantList,
            getPlantList,
            createSpecialRequest
        },
        dispatch,
    );
}


PlantsConfirmation = connect(mapStateToProps, mapDispatchToProps)(PlantsConfirmation);

export default PlantsConfirmation;

module.exports = PlantsConfirmation;