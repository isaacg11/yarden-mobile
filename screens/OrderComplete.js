import React, {Component} from 'react';
import {SafeAreaView, View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/UI/Header';
import Paragraph from '../components/UI/Paragraph';
import Button from '../components/UI/Button';
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';

class OrderComplete extends Component {
  render() {
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
              <Text style={{color: colors.greenD75}}>
                1. If a maintenance plan was selected, then a new maintenance order will be scheduled.
              </Text>
              <Text style={{color: colors.greenD75, marginTop: units.unit5}}>
                2. Use the garden map to keep track of your plants during maintenance services.
              </Text>
              <Text style={{color: colors.greenD75, marginTop: units.unit5}}>
                3. Be sure to let the customer know about any issues you ran into while planting the garden.
              </Text>
            </View>
            <View style={{marginTop: units.unit5}}>
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
