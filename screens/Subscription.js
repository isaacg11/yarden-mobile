// libraries
import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// UI components
import Button from '../components/UI/Button';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Paragraph from '../components/UI/Paragraph';
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import { alert } from '../components/UI/SystemAlert';

// actions
import { getSubscription, deleteSubscription } from '../actions/subscriptions/index';
import { getPlans } from '../actions/plans/index';
import { getOrders, updateOrder, updateOrders } from '../actions/orders/index';
import { updateUser } from '../actions/user/index';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import types from '../vars/types';

class Subscription extends Component {

    state = {
        plan: null,
        subscription: null
    }

    async componentDidMount() {

        // show loading indicator
        this.setState({ isLoading: true });

        // get plants
        await this.props.getPlans();

        // set subscription
        await this.setSubscription();

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.user !== this.props.user) {
            
            // show loading indicator
            this.setState({ isLoading: true });

            // set subscription
            await this.setSubscription();

            // hide loading indicator
            this.setState({ isLoading: false });
        }
    }

    async setSubscription() {

        let plan = null;
        let subscription = null;

        // if user has a maintenance plan {...}
        if (this.props.user.garden_info && this.props.user.garden_info.maintenance_plan) {

            // if no current maintenance plan
            if (this.props.user.garden_info.maintenance_plan === 'none') {
                this.setState({
                    plan,
                    subscription,
                })
            } else if (this.props.user.garden_info.maintenance_plan === types.ASSISTED_PLAN) { // NOTE: This check is necessary because for the new mobile schema we use plan id's instead of name strings - change when mobile app development is done
                // get assisted plan
                plan = this.props.plans.find((p) => p.type === types.ASSISTED_PLAN);
            } else if (this.props.user.garden_info.maintenance_plan === types.FULL_PLAN) { // NOTE: This check is necessary because for the new mobile schema we use plan id's instead of name strings - change when mobile app development is done
                // get full plan
                plan = this.props.plans.find((p) => p.type === types.FULL_PLAN);
            } else {
                // get plan
                plan = this.props.plans.find((p) => p._id === this.props.user.garden_info.maintenance_plan);
            }

            // if user has a payment plan id {...}
            if (this.props.user.payment_info && this.props.user.payment_info.plan_id) {

                // get subscription
                const subscription = await this.props.getSubscription(this.props.user.payment_info.plan_id);

                // update UI
                this.setState({
                    subscription,
                    plan,
                });
            }
        } else {
            this.setState({
                plan,
                subscription,
            })
        }
    }

    async cancel() {
        alert(
            `By cancelling your plan, Yarden will cancel all your scheduled gardening services. You will not be prorated or reimbursed for any subscription payment that was already charged. Once this action has been selected, it cannot be undone.`,
            'Cancel Membership?',
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
                backgroundColor: colors.greenD5,
            }}>
                {/* loading indicator */}
                <LoadingIndicator
                    loading={isLoading}
                />

                {(plan && subscription) && (
                    <View style={{ padding: units.unit3 + units.unit4 }}>

                        {/* subscription start */}
                        <Header type="h4" style={{ marginBottom: units.unit5 }}>
                            Membership
                        </Header>
                        <Card>
                            <View style={{ marginBottom: units.unit5 }}>
                                <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Plan Name</Paragraph>
                                <Paragraph>{plan.type}</Paragraph>
                                <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Description</Paragraph>
                                <Paragraph>{plan.description}</Paragraph>
                                <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Rate</Paragraph>
                                <Paragraph>{`$${subscription.plan.amount / 100}.00 / ${subscription.plan.interval}`}</Paragraph>
                                <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Current Billing Period</Paragraph>
                                <Paragraph>{`${moment(subscription.current_period_start * 1000).format('MM/DD/YYYY')} - ${moment(subscription.current_period_end * 1000).format('MM/DD/YYYY')}`}</Paragraph>
                            </View>
                        </Card>
                        <View style={{ marginTop: units.unit4, marginBottom: units.unit4 }}>
                            <Button
                                text="Change Plan"
                                onPress={() => this.props.navigation.navigate('Change Plan', { currentPlan: plan })}
                                variant="secondary"
                            />
                        </View>
                        <View>
                            <Button
                                text="Cancel Membership"
                                onPress={() => this.cancel()}
                                variant="secondary"
                            />
                        </View>
                    </View>
                )}
                {/* subscription end */}

                {/* no subscription start */}
                {(!plan && !subscription) && (
                    <View style={{ padding: units.unit3 + units.unit4 }}>
                        <Header type="h4" style={{ marginBottom: units.unit5 }}>
                            Membership
                        </Header>
                        <Card>
                            <View>
                                <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5, textAlign: 'center' }}>No membership found</Paragraph>
                                <Paragraph style={{ marginTop: units.unit4, textAlign: 'center' }}>Yarden offers garden maintenance plans to help you grow a successful vegetable garden! Get started by clicking the button below.</Paragraph>
                            </View>
                        </Card>
                        <View style={{ marginTop: units.unit4 }}>
                            <Button
                                text="View Plans"
                                onPress={() => this.props.navigation.navigate('Enrollment', { isCheckout: false })}
                                variant="secondary"
                            />
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
        getPlans,
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