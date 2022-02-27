
import React, { Component } from 'react';
import { Text, SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../components/UI/Button';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import { alert } from '../components/UI/SystemAlert';
import PlantList from '../components/app/PlantList';
import PlantAvailability from '../components/app/PlantAvailability';
import getSeason from '../helpers/getSeason';
import setPlants from '../helpers/setPlants';
import { getPlants } from '../actions/plants/index';

class Garden extends Component {

    state = {
        selectedPlants: []
    }

    async componentDidMount() {

        // show loading indicator
        this.setState({ isLoading: true });

        // set current season
        const season = getSeason();

        // get all plants associated with the current season
        await this.props.getPlants(`season=${season}`);

        // set plants
        const plants = setPlants(this.props.plants);

        // update UI
        this.setState({
            vegetables: plants.vegetables,
            herbs: plants.herbs,
            fruit: plants.fruit,
            isLoading: false
        })
    }

    next() {
        // if user selected too many plants, show error message
        if(this.state.selectedPlants.length > 20) return alert('You selected too many plants. Please adjust your selection to a maximum of 20 plants');

        // set garden plants
        const plants = setPlants(this.state.selectedPlants);

        // set plants
        const vegetables = plants.vegetables;
        const fruit = plants.fruit;
        const herbs = plants.herbs;

        // combine quote and plants
        const quoteAndPlants = {
            quoteTitle: this.props.route.params.title,
            ...{ vegetables, herbs, fruit }
        }

        // set plant selections
        const plantSelections = [quoteAndPlants];

        // combine quote and plants
        const params = {
            ...this.props.route.params,
            ...{ plantSelections },
            ...{isCheckout: true}
        }

        // navigate to plan enrollment
        this.props.navigation.navigate('Enrollment', params);

    }

    render() {

        const {
            selectedPlants,
            isLoading
        } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                {/* loading indicator */}
                <LoadingIndicator loading={isLoading} />

                <ScrollView>
                    <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25, marginBottom: 25 }}>Garden Setup</Text>
                    <View style={{ padding: 12 }}>

                        {/* plant list */}
                        <View style={{ marginBottom: 12 }}>
                            <PlantList
                                plants={this.state}
                                selectedPlants={selectedPlants}
                                onSelect={(selected) => this.setState({ selectedPlants: selected })}
                            />
                        </View>

                        {/* plant availability */}
                        <PlantAvailability />

                        {/* navigation button */}
                        <View>
                            <Button
                                disabled={(selectedPlants.length < 5)}
                                text="Continue"
                                onPress={() => this.next()}
                                variant="primary"
                            />
                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        plants: state.plants
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getPlants
    }, dispatch)
}

Garden = connect(mapStateToProps, mapDispatchToProps)(Garden);

export default Garden;

module.exports = Garden;