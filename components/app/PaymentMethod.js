import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import Button from '../../components/UI/Button';
import Divider from '../../components/UI/Divider';
import Card from '../../components/app/Card';

class PaymentMethod extends Component {

    state = {}

    render() {

        const {
            user
        } = this.props;

        const {
            isOpen
        } = this.state;

        return (
            <View>
                {/* customer card */}
                <Card 
                    newCard={!user.payment_info}
                    isOpen={isOpen}
                    close={() => this.setState({isOpen: false})}
                />

                {/* payment method start */}
                <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                    <View style={{ marginBottom: 12 }}>
                        {(!user.payment_info) && (
                            <View>
                                <Text style={{ textAlign: 'center', marginBottom: 12, marginTop: 12 }}>No payment method found</Text>
                                <Divider />
                                <Button
                                    text="Add Card +"
                                    onPress={() => this.setState({isOpen: true})}
                                    variant="secondary"
                                />
                            </View>
                        )}
                        {(user.payment_info) && (
                            <View>
                                <Text style={{marginBottom: 12}}>{user.payment_info.card_brand} ending in {user.payment_info.card_last4} (Exp: {user.payment_info.card_exp_month}/{user.payment_info.card_exp_year})</Text>
                                <Divider />
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
        )
    }
}
function mapStateToProps(state) {
    return {
        user: state.user,
    }
}

PaymentMethod = connect(mapStateToProps, null)(PaymentMethod);

export default PaymentMethod;

module.exports = PaymentMethod;