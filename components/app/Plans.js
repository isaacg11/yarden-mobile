import React, { Component } from 'react';
import { View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Divider from '../UI/Divider';
import Paragraph from '../UI/Paragraph';
import Card from '../UI/Card';
import units from '../../components/styles/units';

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
            <Card>
                <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5, marginBottom: units.unit5 }}>Plan Selection</Paragraph>
                <Paragraph style={{ marginBottom: units.unit5 }}>
                    Please select a plan from the list below. 1st Month FREE! Cancel anytime.
                </Paragraph>
                <Divider />
                <View style={{ padding: units.unit5 }}>
                    {(plans.map((plan, index) => (
                        <View key={index}>
                            <View style={{ padding: units.unit5, flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ paddingRight: units.unit5, marginRight: units.unit5 }}>
                                    <CheckBox
                                        disabled={(selectedPlan === 'none') || ((selectedPlan.type && selectedPlan.type !== plan.type))}
                                        value={(selectedPlan.type === plan.type)}
                                        onValueChange={() => this.onSelect(plan)}
                                        boxType="square"
                                    />
                                </View>
                                <View>
                                    <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5, marginBottom: units.unit5 }}>{plan.type}</Paragraph>
                                    <Paragraph style={{ marginBottom: units.unit5 }}>${plan.rate.toFixed(2)} / month</Paragraph>
                                </View>
                            </View>
                            <View>
                                <Paragraph style={{ marginBottom: units.unit5, fontStyle: 'italic' }}>{plan.description}</Paragraph>
                                <Divider />
                            </View>
                        </View>
                    )))}
                    <View style={{display: (isCheckout) ? null : 'none'}}>
                        <View style={{ padding: units.unit5, flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ paddingRight: units.unit5, marginRight: units.unit5 }}>
                                <CheckBox
                                    disabled={(selectedPlan.type)}
                                    onValueChange={() => this.onSelect('none')}
                                    boxType="square"
                                />
                            </View>
                            <View>
                                <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5, marginBottom: units.unit5 }}>no plan</Paragraph>
                            </View>
                        </View>
                        <View>
                            <Paragraph style={{ marginBottom: units.unit5, fontStyle: 'italic' }}>None - I want to maintain my garden without any help</Paragraph>
                            <Divider />
                        </View>
                    </View>
                </View>
            </Card>
        )
    }
}

module.exports = Plans;