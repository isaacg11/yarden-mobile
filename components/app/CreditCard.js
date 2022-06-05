import React, { Component } from 'react';
import { View, Modal, ActivityIndicator, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import creditCardType from 'credit-card-type';
import { alert } from '../../components/UI/SystemAlert';
import Button from '../UI/Button';
import Link from '../UI/Link';
import Input from '../UI/Input';
import Header from '../UI/Header';
import CardBrand from '../UI/CardBrand';
import formatCardNumber from '../../helpers/formatCardNumber';
import formatExpDate from '../../helpers/formatExpDate';
import {
  createToken,
  createCustomer,
  deleteCard,
  createCard,
} from '../../actions/cards/index';
import { updateUser } from '../../actions/user/index';
import units from '../styles/units';
import fonts from '../styles/fonts';
import colors from '../styles/colors';

class CreditCard extends Component {
  state = {
    name: '',
    number: '',
    expDate: '',
    cvv: '',
  };

  async save() {
    // show loading indicator
    this.setState({ isLoading: true });

    // remove dashes from card number
    const number = this.state.number.replace(/-/g, '');

    // format card info
    const card = {
      name: this.state.name,
      number: number,
      expMonth: parseInt(this.state.expDate.split('/')[0]),
      expYear: parseInt(this.state.expDate.split('/')[1]),
      cvv: this.state.cvv,
    };

    // create card token
    const token = await this.props.createToken(card);

    // if token {...}
    if (token) {
      // format customer payment info
      let info = {
        token: token.id,
        card_id: token.card.id,
        card_brand: token.card.brand,
        card_last4: token.card.last4,
        card_exp_month: token.card.exp_month,
        card_exp_year: token.card.exp_year,
      };

      // if new card {...}
      if (this.props.newCard) {
        // format customer info
        const customer = {
          userFullName: `${this.props.user.first_name} ${this.props.user.last_name}`,
          userEmail: this.props.user.email,
          token: token.id,
        };

        // create neww customer
        const newCustomer = await this.props.createCustomer(customer);
        info.customer_id = newCustomer.id;
      } else {
        // delete current card
        await this.props.deleteCard();

        // add new card
        await this.props.createCard({ token: token.id });
        info.customer_id = this.props.user.payment_info.customer_id;
      }

      // update user with payment info
      await this.props.updateUser(null, { paymentInfo: info });
    } else {
      // render error
      alert('Invalid card');
    }

    // close the card modal
    this.props.close();

    // hide loading indicator
    this.setState({
      isLoading: false,
      name: '',
      number: '',
      expDate: '',
      cvv: '',
      type: '',
    });
  }

  render() {
    const { isOpen = false, newCard, close } = this.props;

    const { name, number, expDate, cvv, type, isLoading } = this.state;

    const cardVisual = {
      backgroundColor: colors.white75,
      height: units.unit6 + units.unit7 + units.unit4,
      width: '100%',
      justifyContent: 'space-between',
      marginBottom: units.unit4,
      padding: units.unit5,
      borderWidth: 1,
      borderColor: colors.greenC10,
      borderTopColor: 'white',
      borderBottomColor: colors.greenC25,
      borderRadius: units.unit4,
      shadowColor: colors.greenC10,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 1,
      shadowRadius: 8,
    };

    return (
      <View>
        {/* card modal start */}
        <Modal
          animationType="slide"
          visible={isOpen}
          presentationStyle="fullScreen">
          <KeyboardAwareScrollView
            style={{
              backgroundColor: colors.greenE10,
              paddingVertical: units.unit5,
              paddingHorizontal: units.unit4 + units.unit3,
              paddingBottom: units.unit6,
            }}>
            <View>
              <Header
                style={{
                  ...fonts.header,
                  paddingTop: units.unit5,
                  paddingBottom: units.unit4,
                }}>
                {newCard ? 'Add' : 'Update'} Card
              </Header>
              <View style={{ ...cardVisual }}>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      position: 'absolute',
                      left: 0,
                    }}>
                    <CardBrand brand={this.state.type} />
                  </View>
                  <View
                    style={{
                      backgroundColor: colors.greenC50,
                      height: units.unit5,
                      width: units.unit5 + units.unit4,
                      borderWidth: 2,
                      borderColor: colors.greenC10,
                      borderTopColor: colors.greenC25,
                      borderBottomColor: 'white',
                      borderRadius: units.unit2,
                    }}></View>
                </View>
                <View>
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Text>{name || 'Jane Doe'}</Text>
                    <Text>{this.state.cvv || '123'}</Text>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Text>{this.state.number || '####-####-####-####'}</Text>
                    <Text>{this.state.expDate || 'MM/YY'}</Text>
                  </View>
                </View>
              </View>
              <View>
                <Input
                  label="Cardholder Name"
                  onChange={value => this.setState({ name: value })}
                  value={name}
                  placeholder="Ex. Jane Doe"
                />
              </View>
              <View>
                <Input
                  label="Card Number"
                  onChange={value => {
                    // if user already entered 16 digits, do not add more numbers
                    if (value.length > 19) return;

                    // set initial update
                    let update = {
                      number: value,
                      type: '',
                    };

                    // if user has entered at least 4 numbers {...}
                    if (value.length > 3) {
                      // get card types
                      const cardTypes = creditCardType(value);

                      // if card type
                      if (cardTypes && cardTypes.length > 0) {
                        // set card type
                        let cardType = cardTypes[0].type;

                        // replace dashes with spaces
                        cardType = cardType.replace(/-/g, ' ');

                        // add type to update
                        update.type = cardType;
                      }
                    }

                    // update UI
                    this.setState(update);
                  }}
                  value={formatCardNumber(this.state.number)}
                  placeholder="####-####-####-####"
                />
              </View>

              <View>
                <Input
                  label="Exp. Date"
                  onChange={value => {
                    if (value.length > 5) return;
                    this.setState({ expDate: value });
                  }}
                  value={formatExpDate(this.state.expDate)}
                  placeholder="MM/YY"
                />
              </View>
              <View>
                <Input
                  label="CVV"
                  type="numeric"
                  onChange={value => this.setState({ cvv: value })}
                  value={this.state.cvv}
                  placeholder="CVV"
                />
              </View>

              {!isLoading && (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: units.unit6,
                  }}>
                  <View>
                    <Link text="Cancel" onPress={() => close()} />
                  </View>
                  <View>
                    <Button
                      disabled={!type || !name || !number || !expDate || !cvv}
                      text="Save"
                      onPress={() => this.save()}
                      variant="primary"
                    />
                  </View>
                </View>
              )}
              {isLoading && (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    paddingTop: units.unit6,
                  }}>
                  <ActivityIndicator />
                </View>
              )}
            </View>
          </KeyboardAwareScrollView>
        </Modal>
        {/* card modal end */}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createToken,
      createCustomer,
      updateUser,
      deleteCard,
      createCard,
    },
    dispatch,
  );
}

CreditCard = connect(mapStateToProps, mapDispatchToProps)(CreditCard);

export default CreditCard;

module.exports = CreditCard;
