
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
import minifyDataToID from '../helpers/minifyDataToID';
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

        // separate plants by category
        const categorizedPlants = this.separateByCategory(this.props.plants);

        // separate categorized plants by class
        const vegetables = this.separateByClass(categorizedPlants.vegetables);
        const fruit = this.separateByClass(categorizedPlants.fruit);
        const herbs = categorizedPlants.herbs;

        this.setState({
            vegetables: vegetables,
            herbs: herbs,
            fruit: fruit,
            isLoading: false
        })
    }

    separateByCategory(plants) {
        // set initial values
        let vegetables = [];
        let herbs = [];
        let fruit = [];

        // separate plants by category
        plants.forEach((plant) => {
            if (plant.category.name === 'vegetable') vegetables.push(plant);
            if (plant.category.name === 'herb') herbs.push(plant);
            if (plant.category.name === 'fruit') fruit.push(plant);
        })

        // set category data
        const categoryData = {
            vegetables,
            herbs,
            fruit
        }

        // return value
        return categoryData;
    }

    separateByClass(plants) {
        // set initial values
        let fruiting = [];
        let gourd = [];
        let shooting = [];
        let leafy = [];
        let pod = [];
        let bulb = [];
        let root = [];
        let bud = [];
        let berry = [];
        let pit = [];
        let core = [];
        let citrus = [];
        let melon = [];
        let tropical = [];
        let classData = {};

        // separate plants by class
        plants.forEach((plant, index) => {
            if (plant.category.name === 'vegetable') {
                if (plant.class) {
                    if (plant.class.name === 'fruiting') fruiting.push(plant);
                    if (plant.class.name === 'gourd') gourd.push(plant);
                    if (plant.class.name === 'shooting') shooting.push(plant);
                    if (plant.class.name === 'leafy') leafy.push(plant);
                    if (plant.class.name === 'pod') pod.push(plant);
                    if (plant.class.name === 'bulb') bulb.push(plant);
                    if (plant.class.name === 'root') root.push(plant);
                    if (plant.class.name === 'bud') bud.push(plant);
                    if (index === (plants.length - 1)) {
                        classData = {
                            fruiting,
                            gourd,
                            shooting,
                            leafy,
                            pod,
                            bulb,
                            root,
                            bud
                        }
                    }
                }
            }

            if (plant.category.name === 'fruit') {
                if (plant.class) {
                    if (plant.class.name === 'berry') berry.push(plant);
                    if (plant.class.name === 'pit') pit.push(plant);
                    if (plant.class.name === 'core') core.push(plant);
                    if (plant.class.name === 'citrus') citrus.push(plant);
                    if (plant.class.name === 'melon') melon.push(plant);
                    if (plant.class.name === 'tropical') tropical.push(plant);
                    if (index === (plants.length - 1)) {
                        classData = {
                            berry,
                            pit,
                            core,
                            citrus,
                            melon,
                            tropical
                        }
                    }
                }
            }
        })

        return classData;
    }

    next() {
        // if user selected too many plants, show error message
        if(this.state.selectedPlants.length > 20) return alert('You selected too many plants. Please adjust your selection to a maximum of 20 plants');

        // set quote
        const quote = this.props.route.params;

        // separate plants by category
        const categorizedPlants = this.separateByCategory(this.state.selectedPlants);

        // separate categorized plants by class
        let vegetables = this.separateByClass(categorizedPlants.vegetables);
        let fruit = this.separateByClass(categorizedPlants.fruit);
        let herbs = categorizedPlants.herbs;

        // minify plant data to id's
        vegetables = minifyDataToID(vegetables);
        fruit = minifyDataToID(fruit);
        herbs = minifyDataToID(herbs, true);

        // set garden plants
        const plants = {
            vegetables,
            herbs,
            fruit
        }

        // combine quote and plants
        const quoteAndPlants = {
            ...quote,
            ...plants,
            ...{isCheckout: true}
        }

        // navigate to plan enrollment
        this.props.navigation.navigate('Enrollment', quoteAndPlants);

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