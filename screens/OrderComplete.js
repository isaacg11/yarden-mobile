// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Header from '../components/UI/Header';
import Paragraph from '../components/UI/Paragraph';
import Button from '../components/UI/Button';

// types
import types from '../vars/types';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';

class OrderComplete extends Component {

  renderHelperText() {
    switch (this.props.route.params.orderType) {
      case types.INITIAL_PLANTING:
        return {
          step1: 'If a maintenance plan was selected, then a new maintenance order will be scheduled.',
          step2: 'Use the garden map to keep track of your plants during maintenance services.',
          step3: 'Be sure to let the customer know about any issues you ran into while planting the garden.'
        }
      case types.CROP_ROTATION:
        return {
          step1: 'The garden map has been updated with the new plants from the crop rotation service.',
          step2: 'Use the garden map to keep track of your plants during maintenance services.',
          step3: 'Be sure to let the customer know about any issues you ran into while rotating crops.'
        }
      case types.FULL_PLAN || types.ASSISTED_PLAN:
        return {
          step1: 'A new maintenance order will be scheduled for continued service.',
          step2: 'Your service report will be sent to the customer for review.',
          step3: 'Be sure to let the customer know about any issues you ran into while performing maintenance.'
        }
      default:
        return {}
    }
  }

  render() {
    const helperText = this.renderHelperText();
    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
        }}>
        <View
          style={{
            padding: units.unit3 + units.unit4,
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <Header
            style={{
              marginBottom: units.unit4,
              textAlign: 'center',
              fontSize: fonts.h1,
              lineHeight: fonts.h1 + fonts.h1 / 3,
            }}>
            Success!
          </Header>
          <View>
            <Text
              style={{
                fontSize: fonts.h1,
                textAlign: 'center',
                color: colors.purpleB,
              }}>
              ٩( ᐛ )و
            </Text>
            <Paragraph
              style={{
                textAlign: 'center',
                fontSize: fonts.h2,
                color: colors.purpleB,
              }}>
              Your order has been completed, great job!
            </Paragraph>
          </View>
          <View>
            <View>
              <Text
                style={{
                  fontSize: fonts.h3,
                  color: colors.greenD75,
                  lineHeight: fonts.h2,
                }}>
                What happens next?
              </Text>
              <Text style={{ color: colors.greenD75 }}>
                1. {helperText.step1}
              </Text>
              <Text style={{ color: colors.greenD75, marginTop: units.unit5 }}>
                2. {helperText.step2}
              </Text>
              <Text style={{ color: colors.greenD75, marginTop: units.unit5 }}>
                3. {helperText.step3}
              </Text>
            </View>
            <View style={{ marginTop: units.unit5 }}>
              <Button
                alignIconRight
                text="Continue to dashboard"
                onPress={() => this.props.navigation.navigate('Dashboard')}
                icon={
                  <Ionicons
                    name="arrow-forward-outline"
                    size={units.unit4}
                    color={colors.purpleB}
                  />
                }
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

module.exports = OrderComplete;
