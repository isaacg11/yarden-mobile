
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Button from '../components/UI/Button';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Divider from '../components/UI/Divider';
import Paragraph from '../components/UI/Paragraph';
import Card from '../components/UI/Card';
import Header from '../components/UI/Header';
import { alert } from '../components/UI/SystemAlert';
import { updateUser } from '../actions/user/index';
import { getPlans } from '../actions/plans/index';
import { deleteSubscription, createSubscription } from '../actions/subscriptions/index';
import { getOrders, createOrder, updateOrder, updateOrders } from '../actions/orders/index';
import getOrderDescription from '../helpers/getOrderDescription';
import units from '../components/styles/units';

class ChangePlan extends Component {

    state = {
        selectedPlan: {}
    }

    async componentDidMount() {
        // show loading indicator
        this.setState({ isLoading: true });

        // get all plans
        await this.props.getPlans();

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    onSelect(plan) {

        let selectedPlan = 'none';

        // if "none" was selected {...}
        if (plan === 'none') {

            // if "none" is already selected {...}
            if (this.state.selectedPlan === 'none') {
                // reset plan
                selectedPlan = {}
            } else {
                // set plan
                selectedPlan = plan
            }
        } else {
            // determine current selection
            let select = (this.state.selectedPlan.type === plan.type);

            // if already selected {...}
            if (select) {
                // reset plan
                selectedPlan = {}
            } else {
                // set plan
                selectedPlan = plan
            }
        }

        // set plan
        this.setState({ selectedPlan: selectedPlan });
    }

    save() {
        alert(
            `Upon clicking the OK button, you will be enrolled in Yarden's "${this.state.selectedPlan.type}" for routine garden maintenance. A total payment of $${this.state.selectedPlan.rate.toFixed(2)} will be charged today ${moment().format('MM/DD/YYYY')} using the credit card on file ending in ${this.props.user.payment_info.card_last4}`,
            'Change Plan?',
            async () => {
                // show loading indicator
                this.setState({ isLoading: true });

                // cancel current subscription
                await this.cancelSubscription()

                // start new subscription
                await this.startSubscription();

                // navigate to subscription screen
                await this.props.navigation.navigate('Subscription');

                // hide loading indicator
                this.setState({ isLoading: false });
            },
            true
        );
    }

    async cancelSubscription() {

        // delete current subscription
        await this.props.deleteSubscription(this.props.user.payment_info.plan_id);

        // if current maintenance plan {...}
        if (this.props.user.payment_info && this.props.user.payment_info.plan_id) {
            const currentPlan = this.props.plans.find((plan) => plan._id === this.props.user.garden_info.maintenance_plan);

            // if plan found in list of available plans {...}
            if (currentPlan) {

                // cancel any pending maintenance orders
                await this.props.updateOrders(`customer=${this.props.user._id}&type=${currentPlan.type}&status=pending`, { status: 'cancelled' });
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

        // get updated orders
        await this.props.getOrders(`status=pending&start=none&end=${new Date(moment().add(1, 'year'))}`);
    }

    render() {

        const {
            isLoading,
            selectedPlan
        } = this.state;

        const {
            plans
        } = this.props;

        const {
            currentPlan
        } = this.props.route.params;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                {/* loading indicator */}
                <LoadingIndicator loading={isLoading} />

                <ScrollView>
                    <Header type="h4" style={{ textAlign: 'center', marginTop: units.unit6 }}>Change Plan</Header>
                    <View style={{ padding: units.unit5 }}>

                        {/* plan list start */}
                        <Card>
                            <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5, marginBottom: units.unit5 }}>Current Plan</Paragraph>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Paragraph style={{ marginBottom: units.unit5, fontWeight: 'bold', color: '#4d991a' }}>{currentPlan.type}</Paragraph>
                                <Paragraph style={{ marginBottom: units.unit5 }}>${currentPlan.rate.toFixed(2)} / month</Paragraph>
                            </View>

                            <Divider />
                            <View style={{ padding: units.unit5 }}>
                                {(plans.map((plan, index) => (
                                    <View key={index} style={{ display: (plan.type === currentPlan.type) ? 'none' : null }}>
                                        <View style={{ padding: units.unit5, flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ paddingRight: units.unit5, marginRight: units.unit5 }}>
                                                <CheckBox
                                                    disabled={(selectedPlan === 'none') || ((selectedPlan.type && selectedPlan.type !== plan.type))}
                                                    value={(selectedPlan.type === plan.type)}
                                                    onValueChange={() => this.onSelect(plan)}
                                                    boxType="square"
                                                />
                                            </View>
                                            <View>
                                                <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5, marginBottom: units.unit5 }}>{plan.type}</Paragraph>
                                                <Paragraph style={{ marginBottom: units.unit5 }}>${plan.rate.toFixed(2)} / month</Paragraph>
                                            </View>
                                        </View>
                                        <View>
                                            <Paragraph style={{ marginBottom: units.unit5, fontStyle: 'italic' }}>{plan.description}</Paragraph>
                                            <Divider />
                                        </View>
                                    </View>
                                )))}
                            </View>
                        </Card>
                        {/* plan list end */}

                        {/* navigation button */}
                        <View>
                            <Button
                                disabled={!selectedPlan || (selectedPlan !== 'none' && !selectedPlan.type)}
                                text="Save Changes"
                                onPress={() => this.save()}
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
        deleteSubscription,
        createSubscription,
        getOrders,
        updateOrder,
        createOrder,
        updateUser,
        updateOrders
    }, dispatch)
}

ChangePlan = connect(mapStateToProps, mapDispatchToProps)(ChangePlan);

export default ChangePlan;

module.exports = ChangePlan;