import React, { Component } from 'react';
import { View, Text } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Divider from '../UI/Divider';

class Plans extends Component {

    state = {
        selectedPlan: {}
    }

    onSelect(plan) {

        let selectedPlan = 'none';

        // if "none" was selected {...}
        if (plan === 'none') {

            // if "none" is already selected {...}
            if (this.state.selectedPlan === 'none') {
                // reset plan
                selectedPlan = {}
            } else {
                // set plan
                selectedPlan = plan
            }
        } else {
            // determine current selection
            let select = (this.state.selectedPlan.type === plan.type);

            // if already selected {...}
            if (select) {
                // reset plan
                selectedPlan = {}
            } else {
                // set plan
                selectedPlan = plan
            }
        }

        // set plan
        this.setState({selectedPlan: selectedPlan});

        // return value
        this.props.onSelect(selectedPlan);
    }

    render() {

        const { plans, isCheckout } = this.props;
        const { selectedPlan } = this.state;

        return (
            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                <Text style={{ fontWeight: 'bold', marginTop: 12, marginBottom: 12 }}>Plan Selection</Text>
                <Text style={{ marginBottom: 12 }}>
                    Please select a plan from the list below. 1st Month FREE! Cancel anytime.
                </Text>
                <Divider />
                <View style={{ padding: 12 }}>
                    {(plans.map((plan, index) => (
                        <View key={index}>
                            <View style={{ padding: 12, flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ paddingRight: 12, marginRight: 12 }}>
                                    <CheckBox
                                        disabled={(selectedPlan === 'none') || ((selectedPlan.type && selectedPlan.type !== plan.type))}
                                        value={(selectedPlan.type === plan.type)}
                                        onValueChange={() => this.onSelect(plan)}
                                        boxType="square"
                                    />
                                </View>
                                <View>
                                    <Text style={{ fontWeight: 'bold', marginTop: 12, marginBottom: 12 }}>{plan.type}</Text>
                                    <Text style={{ marginBottom: 12 }}>${plan.rate.toFixed(2)} / month</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={{ marginBottom: 12, fontStyle: 'italic' }}>{plan.description}</Text>
                                <Divider />
                            </View>
                        </View>
                    )))}
                    <View style={{display: (isCheckout) ? null : 'none'}}>
                        <View style={{ padding: 12, flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ paddingRight: 12, marginRight: 12 }}>
                                <CheckBox
                                    disabled={(selectedPlan.type)}
                                    onValueChange={() => this.onSelect('none')}
                                    boxType="square"
                                />
                            </View>
                            <View>
                                <Text style={{ fontWeight: 'bold', marginTop: 12, marginBottom: 12 }}>no plan</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{ marginBottom: 12, fontStyle: 'italic' }}>None - I want to maintain my garden without any help</Text>
                            <Divider />
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

module.exports = Plans;