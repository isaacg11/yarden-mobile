// libraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Link from '../UI/Link';
import CreditCard from './CreditCard';
import Paragraph from '../UI/Paragraph';

// styles
import fonts from '../styles/fonts';
import colors from '../styles/colors';

class PaymentMethod extends Component {
  state = {};

  render() {
    const { user } = this.props;

    const { isOpen } = this.state;

    return (
      <View>

        {/* customer card */}
        <CreditCard
          newCard={!user.payment_info}
          isOpen={isOpen}
          close={() => this.setState({ isOpen: false })}
        />

        {/* payment method start */}
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Paragraph style={{ fontWeight: 'bold' }}>Payment Method</Paragraph>
          {user.payment_info && (
            <TouchableOpacity
              onPress={() => this.setState({ isOpen: true })}>
              <Ionicons
                name="pencil-outline"
                size={fonts.h3}
                color={colors.purpleB}
              />
            </TouchableOpacity>
          )}
        </View>
        <View>
          <View>
            {!user.payment_info && (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={{ color: colors.greenD75, fontSize: fonts.h3 }}>
                  No payment method found
                </Text>
                <Link
                  text="Add Card"
                  onPress={() => this.setState({ isOpen: true })}
                />
              </View>
            )}
            {user.payment_info && (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={{ color: colors.greenD75, fontSize: fonts.h3 }}>
                  {user.payment_info.card_brand} ending in{' '}
                  {user.payment_info.card_last4}
                  {'\n'}
                  <Text
                    style={{
                      ...fonts.small,
                      lineHeight: fonts.h5,
                      color: colors.greenD75,
                    }}>
                    (Exp: {user.payment_info.card_exp_month}/
                    {user.payment_info.card_exp_year})
                  </Text>
                </Text>
              </View>
            )}
          </View>
        </View>
        {/* payment method end */}
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

PaymentMethod = connect(mapStateToProps, null)(PaymentMethod);

export default PaymentMethod;

module.exports = PaymentMethod;
