
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Button from '../components/UI/Button';
import { alert } from '../components/UI/SystemAlert';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Paragraph from '../components/UI/Paragraph';
import Plans from '../components/app/Plans';
import Card from '../components/app/Card';
import { getPlans } from '../actions/plans/index';
import { updateUser } from '../actions/user/index';
import { createSubscription } from '../actions/subscriptions/index';
import { createOrder, getOrders } from '../actions/orders/index';
import getOrderDescription from '../helpers/getOrderDescription';

class Enrollment extends Component {

    state = {}

    async componentDidMount() {
        // show loading indicator
        this.setState({ isLoading: true });

        // get all plans
        await this.props.getPlans();

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    async next() {

        // if checkout work-flow {...}
        if (this.props.route.params.isCheckout) {

            // determine if a plan was selected
            const plan = (this.state.selectedPlan !== 'none') ? this.state.selectedPlan._id : 'none';

            // set quote and plants data
            const quoteAndPlants = this.props.route.params;

            // combine quote, plants, and plan
            const quoteAndPlantsAndPlan = {
                ...quoteAndPlants,
                ...{ plan: plan }
            }

            // navigate to checkout
            this.props.navigation.navigate('Checkout', quoteAndPlantsAndPlan);
        } else {

            // if no garden info {...}
            if (!this.props.user.garden_info) {

                // show warning
                return alert(
                    'We cannot find a garden associated with your account. You must have a garden installed to start your subscription.',
                    'No Garden Found',
                );
            } else if (!this.props.user.payment_info) { // if no payment info {...}

                // show the credit card modal
                this.setState({ isOpen: true });

                // show warning
                return alert(
                    'Please add a payment method',
                    'No Payment Method Found'
                );
            } else {
                alert(
                    `Upon clicking the OK button, you will be enrolled in Yarden's "${this.state.selectedPlan.type}" for routine garden maintenance. A total payment of $${this.state.selectedPlan.rate.toFixed(2)} will be charged today ${moment().format('MM/DD/YYYY')} using the credit card on file ending in ${this.props.user.payment_info.card_last4}`,
                    'Start Subscription?',
                    async () => {
                        // show loading indicator
                        this.setState({ isLoading: true });

                        // enroll customer in subscription plan
                        await this.startSubscription();

                        // navigate to subscription
                        this.props.navigation.navigate('Subscription');

                        // show loading indicator
                        this.setState({ isLoading: false });
                    },
                    true
                );
            }
        }
    }

    async startSubscription() {

        // format subscription
        const newSubscription = {
            customerId: this.props.user.payment_info.customer_id,
            userId: this.props.user._id,
            selectedPlan: this.state.selectedPlan.type,
            trialPeriod: 'none'
        }

        // create new subscription
        const subscription = await this.props.createSubscription(newSubscription);

        // format new user info
        const paymentInfo = this.props.user.payment_info;
        const gardenInfo = this.props.user.garden_info;
        paymentInfo.plan_id = subscription.id;
        gardenInfo.maintenance_plan = this.state.selectedPlan._id;

        // update user with new payment info and garden info
        await this.props.updateUser(`userId=${this.props.user._id}`, { paymentInfo: paymentInfo, gardenInfo: gardenInfo });

        // format order data
        const workOrder = {
            type: this.state.selectedPlan.type,
            customer: this.props.user._id,
            description: getOrderDescription(this.state.selectedPlan.type),
            date: new Date(moment().add(1, 'week').startOf('day'))
        }

        // create new order
        await this.props.createOrder(workOrder);

        // get pending orders
        await this.props.getOrders(`status=pending&start=none&end=${new Date(moment().add(1, 'year'))}`);
    }

    render() {

        const {
            isLoading,
            selectedPlan,
            isOpen
        } = this.state;

        const {
            plans,
            user
        } = this.props;

        const {
            isCheckout
        } = this.props.route.params;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                {/* loading indicator */}
                <LoadingIndicator loading={isLoading} />

                {/* customer card */}
                <Card
                    newCard={!user.payment_info}
                    isOpen={isOpen}
                    close={() => this.setState({ isOpen: false })}
                />

                <ScrollView>
                    <Paragraph style={{ fontSize: 25, textAlign: 'center', marginTop: 25, marginBottom: 25 }}>Maintenance Plans</Paragraph>
                    <View style={{ padding: 12 }}>

                        {/* plan list */}
                        <Plans
                            plans={plans}
                            onSelect={(plan) => this.setState({ selectedPlan: plan })}
                            isCheckout={isCheckout}
                        />

                        {/* navigation button */}
                        <View>
                            <Button
                                disabled={!selectedPlan || (selectedPlan !== 'none' && !selectedPlan.type)}
                                text="Continue"
                                onPress={() => this.next()}
                                variant="primary"
                            />
                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        plans: state.plans,
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getPlans,
        updateUser,
        createOrder,
        createSubscription,
        getOrders,
    }, dispatch)
}

Enrollment = connect(mapStateToProps, mapDispatchToProps)(Enrollment);

export default Enrollment;

module.exports = Enrollment;