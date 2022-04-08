import React, {Component} from 'react';
import {ScrollView, View, Modal, ActivityIndicator, Text} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Dropdown from '../UI/Dropdown';
import Header from '../UI/Header';
import formatCardNumber from '../../helpers/formatCardNumber';
import formatExpDate from '../../helpers/formatExpDate';
import {
  createToken,
  createCustomer,
  deleteCard,
  createCard,
} from '../../actions/cards/index';
import {updateUser} from '../../actions/user/index';
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
    this.setState({isLoading: true});

    // remove dashes from card number
    const number = this.state.number.replace(/-/g, '');

    // format card info
    const card = {
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
        await this.props.createCard({token: token.id});
        info.customer_id = this.props.user.payment_info.customer_id;
      }

      // update user with payment info
      await this.props.updateUser(null, {paymentInfo: info});
    }

    // close the card modal
    this.props.close();

    // hide loading indicator
    this.setState({isLoading: false});
  }

  render() {
    const {isOpen = false, newCard, close} = this.props;

    const {number, expDate, cvv, type, isLoading} = this.state;

    const cardVisual = {
      backgroundColor: colors.white75,
      height: units.unit6 + units.unit7,
      width: '100%',
      justifyContent: 'space-between',
      marginBottom: units.unit4,
      shadowColor: colors.greenC10,
      padding: units.unit5,
      borderWidth: 1,
      borderColor: colors.greenC10,
      borderTopColor: 'white',
      borderBottomColor: colors.greenC25,
      borderRadius: units.unit4,
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
          <ScrollView
            style={{marginTop: units.unit5, backgroundColor: colors.greenE10}}>
            <View style={{padding: units.unit5}}>
              <Header style={{fontSize: fonts.h2, marginBottom: units.unit5}}>
                {newCard ? 'Add' : 'Update'} Card
              </Header>

              {/* TODO: depending on card type, conditionally render a card type logo, MasterCard, Visa, etc */}
              <View style={{...cardVisual}}>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: colors.purple0,
                      fontWeight: 'bold',
                      fontFamily: fonts.default,
                    }}>
                    {this.state.type || 'LOGO'}
                  </Text>
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
                    <Text>{this.state.name || 'Jane Doe'}</Text>
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
                <Dropdown
                  label="Card Type"
                  onChange={value => this.setState({type: value})}
                  options={[
                    {
                      label: 'Visa',
                      value: 'visa',
                    },
                    {
                      label: 'Mastercard',
                      value: 'mastercard',
                    },
                    {
                      label: 'American Express',
                      value: 'american express',
                    },
                    {
                      label: 'Discover',
                      value: 'discover',
                    },
                  ]}
                  placeholder="Select Card Type ..."
                />
              </View>
              <View>
                <Input
                  label="Cardholder Name"
                  onChange={value => this.setState({name: value})}
                  value={this.state.name}
                  placeholder="Ex. Jane Doe"
                />
              </View>
              <View>
                <Input
                  label="Card Number"
                  onChange={value => {
                    if(value.length > 19) return;
                    this.setState({number: value});
                  }}
                  value={formatCardNumber(this.state.number)}
                  placeholder="####-####-####-####"
                />
              </View>
              <View>
                <Input
                  label="Exp. Date"
                  onChange={value => {
                    if(value.length > 5) return;
                    this.setState({expDate: value});
                  }}
                  value={formatExpDate(this.state.expDate)}
                  placeholder="MM/YY"
                />
              </View>
              <View>
                <Input
                  label="CVV"
                  type="numeric"
                  onChange={value => this.setState({cvv: value})}
                  value={this.state.cvv}
                  placeholder="CVV"
                />
              </View>
              {!isLoading && (
                <View>
                  <View style={{marginBottom: units.unit4}}>
                    <Button
                      disabled={!type || !number || !expDate || !cvv}
                      text="Save"
                      onPress={() => this.save()}
                      variant="primary"
                    />
                  </View>
                  <View>
                    <Button
                      text="Cancel"
                      onPress={() => close()}
                      variant="btn2"
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
          </ScrollView>
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
