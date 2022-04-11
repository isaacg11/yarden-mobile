import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import Button from '../../components/UI/Button';
import Paragraph from '../../components/UI/Paragraph';
import CreditCard from './CreditCard';
import units from '../../components/styles/units';

class PaymentMethod extends Component {
  state = {};

  render() {
    const {user} = this.props;

    const {isOpen} = this.state;

    return (
      <View>
        {/* customer card */}
        <CreditCard
          newCard={!user.payment_info}
          isOpen={isOpen}
          close={() => this.setState({isOpen: false})}
        />

        {/* payment method start */}
        <View>
          <View style={{marginBottom: units.unit5}}>
            {!user.payment_info && (
              <View>
                <Paragraph
                  style={{
                    textAlign: 'center',
                    marginBottom: units.unit5,
                    marginTop: units.unit5,
                  }}>
                  No payment method found
                </Paragraph>
                <Button
                  text="Add Card +"
                  onPress={() => this.setState({isOpen: true})}
                  variant="secondary"
                />
              </View>
            )}
            {user.payment_info && (
              <View>
                <Paragraph style={{marginBottom: units.unit5}}>
                  {user.payment_info.card_brand} ending in{' '}
                  {user.payment_info.card_last4} (Exp:{' '}
                  {user.payment_info.card_exp_month}/
                  {user.payment_info.card_exp_year})
                </Paragraph>
                <Button
                  text="Edit"
                  onPress={() => this.setState({isOpen: true})}
                  variant="secondary"
                />
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
