
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../components/UI/Button';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import { alert } from '../components/UI/SystemAlert';
import PlantList from '../components/app/PlantList';
import getSeason from '../helpers/getSeason';
import setPlants from '../helpers/setPlants';
import { getPlants } from '../actions/plants/index';
import units from '../components/styles/units';

class Plants extends Component {

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

    onSelect(quote, selected) {
        this.setState({ [quote.title]: selected });
    }

    next() {
        // set current quotes
        const quotes = this.props.route.params.quotes;

        const plantSelections = [];

        let matches = 0;

        // iterate through state
        for (let item in this.state) {

            // check title for a quote that matches
            const match = quotes.find((quote) => quote.title === item);

            // if match {...}
            if (match) {

                // increase matches
                matches += 1;

                // if user selected too many plants, show error message
                if (this.state[item].length > 20) return alert(`You selected too many plants for "${match.title}". Please adjust your selection to a maximum of 20 plants`);

                // if user selected too few plants, show error message
                if (this.state[item].length < 5) return alert(`You did not select enough plants for "${match.title}". Please adjust your selection to a minimum of 5 plants`);

                // set garden plants
                const plants = setPlants(this.state[item]);

                // minify plant data to id's
                const vegetables = plants.vegetables;
                const fruit = plants.fruit;
                const herbs = plants.herbs;

                // combine quote and plants
                const quoteAndPlants = {
                    quoteTitle: match.title,
                    ...{ vegetables, herbs, fruit}
                }

                plantSelections.push(quoteAndPlants);
            }
        }

        // if no plants were selected, show error message
        if(!matches) return alert(`You didn't select any plants. Please adjust your selection to a minimum of 5 plants`);

        // set params
        const params = {
            ...this.props.route.params,
            ...{ plantSelections }
        }

        // navigate to checkout
        this.props.navigation.navigate('Checkout', params);
    }

    render() {

        const {
            selectedPlants,
            isLoading
        } = this.state;

        const {
            quotes
        } = this.props.route.params;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                {/* loading indicator */}
                <LoadingIndicator loading={isLoading} />

                <ScrollView>
                    <Header type="h4" style={{ marginTop: units.unit6 }}>Plants Setup</Header>
                    <View style={{ padding: units.unit5 }}>

                        {/* plant list */}
                        {quotes.map((quote, index) => {

                            if(quote.product.type.name === 'garden') {
                                return (
                                    <View key={index} style={{ marginBottom: units.unit5 }}>
                                        <PlantList
                                            title={quote.description}
                                            plants={this.state}
                                            selectedPlants={selectedPlants}
                                            onSelect={(selected) => this.onSelect(quote, selected)}
                                        />
                                    </View>
                                )
                            }
                        })}

                        {/* navigation button */}
                        <View>
                            <Button
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
        plants: state.plants,
        items: state.items
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getPlants
    }, dispatch)
}

Plants = connect(mapStateToProps, mapDispatchToProps)(Plants);

export default Plants;

module.exports = Plants;