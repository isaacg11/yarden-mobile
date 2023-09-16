import React, { Component } from 'react';
import { View, Text } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Paragraph from '../UI/Paragraph';
import Label from '../UI/Label';
import Card from '../UI/Card';
import units from '../../components/styles/units';
import colors from '../styles/colors';

class Plans extends Component {
  state = {
    selectedPlan: {},
  };

  onSelect(plan) {
    let selectedPlan = 'none';

    // if "none" was selected {...}
    if (plan.type === 'none') {
      
      // if "none" is already selected {...}
      if (this.state.selectedPlan === 'none') {
        // reset plan
        selectedPlan = {};
      } else {
        // set plan
        selectedPlan = plan;
      }
    } else {
      // determine current selection
      let select = this.state.selectedPlan.type === plan.type;

      // if already selected {...}
      if (select) {
        // reset plan
        selectedPlan = {};
      } else {
        // set plan
        selectedPlan = plan;
      }
    }

    // set plan
    this.setState({ selectedPlan });

    // return value
    this.props.onSelect(selectedPlan);
  }

  render() {
    const { plans, isCheckout } = this.props;
    const { selectedPlan } = this.state;

    return (
      <View>
        <Text style={{ marginBottom: units.unit5, color: colors.greenD75 }}>
          Please select a plan from the list below. 1st Month FREE! Cancel
          anytime.
        </Text>
        <Label style={{ marginBottom: units.unit2 }}>Plans</Label>
        <View>
          {plans.map((plan, index) => (
            <Card style={{ marginBottom: units.unit4 }} key={index}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: units.unit4,
                }}>
                <View
                  style={{ paddingRight: units.unit4, marginRight: units.unit0 }}>
                  <CheckBox
                    disabled={
                      selectedPlan === 'none' ||
                      (selectedPlan.type && selectedPlan.type !== plan.type)
                    }
                    value={selectedPlan.type === plan.type}
                    onValueChange={() => this.onSelect(plan)}
                    boxType="square"
                    tintColor={colors.purpleB}
                    onTintColor={colors.green0}
                    onCheckColor={colors.green0}
                    onFillColor={colors.purpleB}
                  />
                </View>
                <View>
                  <Paragraph
                    style={{
                      fontWeight: 'bold',
                      color: colors.purpleB,
                      textTransform: 'capitalize',
                    }}>
                    {plan.type}
                  </Paragraph>
                  <Paragraph style={{ color: colors.greenD }}>
                    ${plan.rate.toFixed(2)} / month
                  </Paragraph>
                </View>
              </View>
              <View>
                <Text style={{ color: colors.greenD75 }}>{plan.description}</Text>
              </View>
            </Card>
          ))}
          <View
            style={{ padding: units.unit4, display: isCheckout ? null : 'none' }}>
            <View
              style={{
                flex: 1,
                alignSelf: 'stretch',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: units.unit4,
              }}>
              <View
                style={{ paddingRight: units.unit4, marginRight: units.unit0 }}>
                <CheckBox
                  disabled={selectedPlan.type}
                  onValueChange={() => this.onSelect({ type: 'none' })}
                  boxType="square"
                  tintColor={colors.purpleB}
                  onTintColor={colors.green0}
                  onCheckColor={colors.green0}
                  onFillColor={colors.purpleB}
                />
              </View>
              <View>
                <Paragraph
                  style={{
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                    color: colors.purpleB,
                    textTransform: 'capitalize',
                  }}>
                  no plan
                </Paragraph>
              </View>
            </View>
            <View>
              <Text style={{ marginBottom: units.unit5, color: colors.greenD75 }}>
                None - I want to maintain my garden without any help
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

module.exports = Plans;
