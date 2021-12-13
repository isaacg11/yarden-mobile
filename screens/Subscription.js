
import React, { Component } from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../components/UI/Button';
import Divider from '../components/UI/Divider';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import { alert } from '../components/UI/SystemAlert';
import { getSubscription, deleteSubscription } from '../actions/subscriptions/index';
import { getPlan } from '../actions/plans/index';
import { getOrders, updateOrder, updateOrders } from '../actions/orders/index';
import { updateUser } from '../actions/user/index';

class Subscription extends Component {

    state = {
        plan: null,
        subscription: null
    }

    componentDidMount() {
        this.setSubscription();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.user !== this.props.user) {
            this.setSubscription();
        }
    }

    async setSubscription() {
        // show loading indicator
        this.setState({ isLoading: true });

        // if user has a maintenance plan {...}
        if (this.props.user.garden_info && this.props.user.garden_info.maintenance_plan) {

            // if no current maintenance plan
            if (this.props.user.garden_info.maintenance_plan === 'none') {
                this.setState({
                    plan: null,
                    subscription: null
                })
            } else {
                // get plan
                const plan = await this.props.getPlan(this.props.user.garden_info.maintenance_plan);

                // if user has a payment plan id {...}
                if (this.props.user.payment_info && this.props.user.payment_info.plan_id) {

                    // get subscription
                    const subscription = await this.props.getSubscription(this.props.user.payment_info.plan_id);

                    this.setState({
                        subscription: subscription,
                        plan: plan
                    });
                }
            }
        }

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    async cancel() {
        alert(
            `By cancelling your plan, Yarden will cancel all your scheduled gardening services. You will not be prorated or reimbursed for any subscription payment that was already charged. Once this action has been selected, it cannot be undone.`,
            'Cancel Subscription?',
            async () => {
                // show loading indicator
                this.setState({ isLoading: true });

                // cancel subscription
                await this.cancelSubscription();

                // hide loading indicator
                this.setState({ isLoading: false });
            },
            true
        );
    }

    async cancelSubscription() {

        // delete subscription
        await this.props.deleteSubscription(this.props.user.payment_info.plan_id);

        // if current plan {...}
        if (this.state.plan && this.state.plan.type) {

            // cancel any pending maintenance orders
            await this.props.updateOrders(`customer=${this.props.user._id}&type=${this.state.plan.type}&status=pending`, { status: 'cancelled' })

            // get updated orders
            await this.props.getOrders(`status=pending&start=none&end=${new Date(moment().add(1, 'year'))}`);
        }

        // format new user info
        const paymentInfo = this.props.user.payment_info;
        const gardenInfo = this.props.user.garden_info;
        paymentInfo.plan_id = null;
        gardenInfo.maintenance_plan = 'none';

        // update user with new payment info and garden info
        await this.props.updateUser(`userId=${this.props.user._id}`, { paymentInfo: paymentInfo, gardenInfo: gardenInfo });
    }

    render() {

        const {
            subscription,
            plan,
            isLoading
        } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>

                {/* loading indicator */}
                <LoadingIndicator
                    loading={isLoading}
                />

                <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25, marginBottom: 25 }}>Subscription</Text>

                {/* subscription start */}
                {(plan && subscription) && (
                    <View style={{ padding: 12 }}>
                        <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                            <View style={{ marginBottom: 12 }}>
                                <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Plan Name</Text>
                                <Text>{plan.type}</Text>
                                <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Description</Text>
                                <Text>{plan.description}</Text>
                                <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Rate</Text>
                                <Text>{`$${subscription.plan.amount / 100}.00 / ${subscription.plan.interval}`}</Text>
                                <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Current Billing Period</Text>
                                <Text>{`${moment(subscription.current_period_start * 1000).format('MM/DD/YYYY')} - ${moment(subscription.current_period_end * 1000).format('MM/DD/YYYY')}`}</Text>
                            </View>
                            <Divider />
                            <View style={{ marginBottom: 12 }}>
                                <Button
                                    text="Change Plan"
                                    onPress={() => this.props.navigation.navigate('Change Plan', { currentPlan: plan })}
                                    variant="secondary"
                                />
                            </View>
                            <Divider />
                            <View>
                                <Button
                                    text="Cancel Subscription"
                                    onPress={() => this.cancel()}
                                    variant="secondary"
                                />
                            </View>
                        </View>
                    </View>
                )}
                {/* subscription end */}

                {/* no subscription start */}
                {(!plan && !subscription) && (
                    <View style={{ padding: 12 }}>
                        <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                            <View style={{ marginBottom: 12 }}>
                                <Text style={{ fontWeight: 'bold', marginTop: 12, textAlign: 'center' }}>No subscription found</Text>
                                <Text style={{ marginTop: 12 }}>Yarden offers garden maintenance subscription plans to help you grow a successful vegetable garden! Get started by clicking the button below.</Text>
                            </View>
                            <Divider />
                            <View>
                                <Button
                                    text="View Plans"
                                    onPress={() => this.props.navigation.navigate('Enrollment', { isCheckout: false })}
                                    variant="secondary"
                                />
                            </View>
                        </View>
                    </View>
                )}
                {/* no subscription end */}

            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        plans: state.plans
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getSubscription,
        getPlan,
        deleteSubscription,
        getOrders,
        updateOrder,
        updateUser,
        updateOrders
    }, dispatch)
}

Subscription = connect(mapStateToProps, mapDispatchToProps)(Subscription);

export default Subscription;

module.exports = Subscription;