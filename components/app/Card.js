import React, { Component } from 'react';
import { View, Modal, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Dropdown from '../../components/UI/Dropdown';
import Paragraph from '../../components/UI/Paragraph';
import formatCardNumber from '../../helpers/formatCardNumber';
import formatExpDate from '../../helpers/formatExpDate';
import { createToken, createCustomer, deleteCard, createCard } from '../../actions/cards/index';
import { updateUser } from '../../actions/user/index';

class Card extends Component {

    state = {
        number: '',
        expDate: '',
        cvv: ''
    }

    async save() {
        // show loading indicator
        this.setState({ isLoading: true });

        // remove dashes from card number
        const number = this.state.number.replace(/-/g, "");

        // format card info
        const card = {
            number: number,
            expMonth: parseInt(this.state.expDate.split('/')[0]),
            expYear: parseInt(this.state.expDate.split('/')[1]),
            cvv: this.state.cvv
        }

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
            }

            // if new card {...}
            if (this.props.newCard) {
                // format customer info
                const customer = {
                    userFullName: `${this.props.user.first_name} ${this.props.user.last_name}`,
                    userEmail: this.props.user.email,
                    token: token.id
                }

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
            await this.props.updateUser(null, { paymentInfo: info });
        }

        // close the card modal
        this.props.close();

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    render() {
        const {
            isOpen = false,
            newCard,
            close
        } = this.props;

        const {
            number,
            expDate,
            cvv,
            type,
            isLoading
        } = this.state;

        return (
            <View>

                {/* card modal start */}
                <Modal
                    animationType="slide"
                    visible={isOpen}
                    presentationStyle="fullScreen"
                >
                    <View style={{ marginTop: 50 }}>
                        <View style={{ padding: 12 }}>
                            <Paragraph style={{ fontSize: 25 }}>{(newCard) ? 'Add' : 'Update'} Card</Paragraph>
                            <View>
                                <Dropdown
                                    onChange={(value) => this.setState({ type: value })}
                                    options={[
                                        {
                                            label: 'Visa',
                                            value: 'visa'
                                        },
                                        {
                                            label: 'Mastercard',
                                            value: 'mastercard'
                                        },
                                        {
                                            label: 'American Express',
                                            value: 'american express'
                                        },
                                        {
                                            label: 'Discover',
                                            value: 'discover'
                                        }
                                    ]}
                                    placeholder="Card Type"
                                />
                            </View>
                            <View>
                                <Input
                                    onChange={(value) => this.setState({ number: value })}
                                    value={formatCardNumber(number, type)}
                                    placeholder="Card Number"
                                />
                            </View>
                            <View>
                                <Input
                                    onChange={(value) => this.setState({ expDate: value })}
                                    value={formatExpDate(expDate)}
                                    placeholder="Exp Date"
                                />
                            </View>
                            <View>
                                <Input
                                    type="numeric"
                                    onChange={(value) => this.setState({ cvv: value })}
                                    value={cvv}
                                    placeholder="CVV"
                                />
                            </View>
                            {(!isLoading) && (
                                <View>
                                    <View>
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
                                            variant="secondary"
                                        />
                                    </View>
                                </View>
                            )}
                            {(isLoading) && (
                                <View style={{ flex: 1, justifyContent: "center", paddingTop: 25 }}>
                                    <ActivityIndicator />
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>
                {/* card modal end */}

            </View>

        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        createToken,
        createCustomer,
        updateUser,
        deleteCard, 
        createCard 
    }, dispatch)
}

Card = connect(mapStateToProps, mapDispatchToProps)(Card);

export default Card;

module.exports = Card;