
import React, { Component } from 'react';
import { Text, SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout } from '../actions/auth/index';
import PaymentSchedule from '../components/app/PaymentSchedule';
import PaymentMethod from '../components/app/PaymentMethod';
import Approval from '../components/app/Approval';
import Collapse from '../components/UI/Collapse';
import LoadingIndicator from '../components/UI/LoadingIndicator';

class Checkout extends Component {

    state = {}

    render() {

        const { isLoading } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <ScrollView>

                    {/* loading indicator */}
                    <LoadingIndicator
                        loading={isLoading}
                    />

                    <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25, marginBottom: 12 }}>Checkout</Text>
                    <View style={{ padding: 12 }}>

                        {/* payment schedule */}
                        <View style={{ marginTop: 12 }}>
                            <Collapse
                                title="Payment Schedule"
                                content={
                                    <PaymentSchedule
                                        quote={this.props.route.params}
                                    />
                                }
                            />
                        </View>

                        {/* payment method */}
                        <View style={{ marginTop: 12 }}>
                            <Collapse
                                title="Payment Method"
                                content={
                                    <PaymentMethod />
                                }
                            />
                        </View>

                        {/* approval */}
                        <View style={{ marginTop: 12 }}>
                            <Collapse
                                title="Quote Approval"
                                open={true}
                                content={
                                    <Approval 
                                        quote={this.props.route.params}
                                        vegetables={this.props.route.params.vegetables}
                                        herbs={this.props.route.params.herbs}
                                        fruit={this.props.route.params.fruit}
                                        plan={this.props.route.params.plan}
                                        isChangeOrder={this.props.route.params.isChangeOrder}
                                        onApproved={() => this.props.navigation.navigate('Approved')}
                                    />
                                }
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        logout
    }, dispatch)
}

Checkout = connect(null, mapDispatchToProps)(Checkout);

export default Checkout;

module.exports = Checkout;