
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PaymentSchedule from '../components/app/PaymentSchedule';
import PaymentMethod from '../components/app/PaymentMethod';
import Approval from '../components/app/Approval';
import Collapse from '../components/UI/Collapse';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import { getItems } from '../actions/items/index';
import clearCart from '../helpers/clearCart';
import units from '../components/styles/units';

class Checkout extends Component {

    state = {}

    async onApproved() {
        // clear cart
        await clearCart(this.props.items);

        // get updated item list
        await this.props.getItems();

        // navigate to approved page
        this.props.navigation.navigate('Approved');
    }

    render() {

        const { isLoading } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <ScrollView>
                    <View style={{ padding: units.unit3 + units.unit4 }}>

                        {/* loading indicator */}
                        <LoadingIndicator
                            loading={isLoading}
                        />

                        <Header type="h4" style={{ marginBottom: units.unit5 }}>Checkout</Header>
                        <View>

                            {/* payment method */}
                            <View>
                                <Collapse
                                    title="Payment Method"
                                    open={true}
                                    content={
                                        <PaymentMethod />
                                    }
                                />
                            </View>

                            {/* payment schedule */}
                            <View>
                                <Collapse
                                    title="Payment Schedule"
                                    content={
                                        <PaymentSchedule
                                            quote={this.props.route.params}
                                            quotes={this.props.route.params.quotes}
                                        />
                                    }
                                />
                            </View>

                            {/* approval */}
                            <View>
                                <Collapse
                                    title="Payment Approval"
                                    open={true}
                                    content={
                                        <Approval
                                            quote={this.props.route.params}
                                            quotes={this.props.route.params.quotes}
                                            plantSelections={this.props.route.params.plantSelections}
                                            plan={this.props.route.params.plan}
                                            isChangeOrder={this.props.route.params.isChangeOrder}
                                            isPurchase={this.props.route.params.isPurchase}
                                            onApproved={() => this.onApproved()}
                                        />
                                    }
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        items: state.items
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getItems
    }, dispatch)
}

Checkout = connect(mapStateToProps, mapDispatchToProps)(Checkout);

export default Checkout;

module.exports = Checkout;