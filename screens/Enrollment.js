
import React, { Component } from 'react';
import { Text, SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../components/UI/Button';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Plans from '../components/app/Plans';
import { getPlans } from '../actions/plans/index';

class Enrollment extends Component {

    state = {}

    async componentDidMount() {
        // show loading indicator
        this.setState({ isLoading: true });

        // get all plans
        await this.props.getPlans();

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    next() {
        // determine if a plan was seleted
        const plan = (this.state.selectedPlan !== 'none') ? this.state.selectedPlan._id : 'none';

        // set quote and plants data
        const quoteAndPlants = this.props.route.params;

        // combine quote, plants, and plan
        const quoteAndPlantsAndPlan = {
            ...quoteAndPlants,
            ...{ plan: plan }
        }

        // navigate to checkout
        this.props.navigation.navigate('Checkout', quoteAndPlantsAndPlan);
    }

    render() {

        const {
            isLoading,
            selectedPlan
        } = this.state;

        const {
            plans
        } = this.props;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                {/* loading indicator */}
                <LoadingIndicator loading={isLoading} />

                <ScrollView>
                    <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25, marginBottom: 25 }}>Maintenance Plan</Text>
                    <View style={{ padding: 12 }}>

                        {/* plan list */}
                        <Plans
                            plans={plans}
                            onSelect={(plan) => this.setState({ selectedPlan: plan })}
                        />

                        {/* navigation button */}
                        <View>
                            <Button
                                disabled={!selectedPlan || (selectedPlan !== 'none' && !selectedPlan.type)}
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
        plans: state.plans
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getPlans
    }, dispatch)
}

Enrollment = connect(mapStateToProps, mapDispatchToProps)(Enrollment);

export default Enrollment;

module.exports = Enrollment;