import React, { Component } from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CheckBox from '@react-native-community/checkbox';
import vars from '../../vars/index';
import Divider from '../../components/UI/Divider';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Link from '../../components/UI/Link';
import LoadingIndicator from '../../components/UI/LoadingIndicator';
import { alert } from '../../components/UI/SystemAlert';
import ElectronicSignatureAgreement from '../../components/app/ElectronicSignatureAgreement';
import calculateQuoteCost from '../../helpers/calculateQuote';
import delimit from '../../helpers/delimit';
import getCompanyName from '../../helpers/getCompanyName';
import getScreenShot from '../../helpers/getScreenShot';
import uploadImage from '../../helpers/uploadImage';
import formatAddress from '../../helpers/formatAddress';
import { chargeCard } from '../../actions/cards/index';
import { getIP } from '../../actions/location/index';
import { createApproval } from '../../actions/approvals/index';
import { createOrder, getOrders } from '../../actions/orders/index';
import { updateQuote, getQuotes } from '../../actions/quotes/index';
import { sendAlert } from '../../actions/alerts/index';
import { sendEmail } from '../../actions/emails/index';
import { updateUser } from '../../actions/user/index';
import { updateChangeOrder, getChangeOrders, resetChangeOrders } from '../../actions/changeOrders/index';

class Approval extends Component {

    state = {}

    async scheduleNewOrder(approval) {
        // format new order
        let newOrder = {
            customer: this.props.user._id,
            approval: approval._id,
            type: (this.props.quote.type) ? this.props.quote.type : 'misc',
            date: moment().add(2, 'weeks'),
            time: '10',
            description: this.props.quote.description,
            bid: this.props.quote._id
        }

        // if order is for a new garden {...}
        if (this.props.quote.type === 'installation' || this.props.quote.type === 'revive') {

            // set project phase to 1
            newOrder.phase = 1;

            // set garden info
            let gardenInfo = {};
            if (this.props.vegetables) gardenInfo.vegetables = this.props.vegetables;
            if (this.props.herbs) gardenInfo.herbs = this.props.herbs;
            if (this.props.fruit) gardenInfo.fruit = this.props.fruit;
            if (this.props.plan) gardenInfo.maintenance_plan = this.props.plan;

            // update user with garden info
            await this.props.updateUser(null, { gardenInfo: gardenInfo })
        }

        // if a vendor created this quote, then set the order assignment to this vendor
        if (this.props.quote.vendor) newOrder.vendor = this.props.quote.vendor._id;

        // create work order
        const order = await this.props.createOrder(newOrder);

        // return value
        return order;
    }

    async approve() {

        // if no payment method, show error
        if (!this.props.user.payment_info) return alert('Please add a payment method');

        // show loading indicator
        this.setState({ isLoading: true });

        // get line item costs
        const q = calculateQuoteCost(this.props.quote.line_items);

        // calculate total quote cost
        const amount = (((q.materialsTotal + q.deliveryTotal + q.rentalTotal + q.disposalTotal) + (q.materialsTotal * vars.tax.ca)) + (((q.materialsTotal + q.deliveryTotal + q.rentalTotal + q.disposalTotal) + (q.materialsTotal * vars.tax.ca)) * vars.fees.payment_processing));

        // format from dollars to cents
        const total = (parseFloat(amount).toFixed(2) * 100);

        // format payment description for materials
        const description = `Materials - ${this.props.quote.description}`;

        // format payment
        const payment = {
            amount: total,
            currency: 'usd',
            description: description,
            statement_descriptor_suffix: `Materials`,
        }

        // charge card
        const charge = await this.props.chargeCard(payment);

        // if charge failed, show error message
        if (charge.status !== 200) {
            alert('Payment failed, please try again');
        } else {
            // get user IP (proof of location at time of approval)
            const ip = await this.props.getIP();

            // take screenshot (proof of approval agreement)
            const screenshot = await getScreenShot();

            // save screenshot of approval image
            const approvalImage = await uploadImage(screenshot, 'approval');

            // format new approval
            const newApproval = {
                image: approvalImage,
                location: ip.data
            }

            // create approval
            const approval = await this.props.createApproval(newApproval);

            // set empty order
            let order = {};

            // if approval is for a change order {...}
            if (this.props.isChangeOrder) {

                // update change order as "approved"
                await this.props.updateChangeOrder(this.props.quote._id, { status: 'approved', approval: approval._id });

                // assign order value
                order = this.props.quote.order;
            } else {
                // update quote as "approved"
                await this.props.updateQuote(this.props.quote._id, { status: 'approved' });

                // schedule a new order
                order = await this.scheduleNewOrder(approval);
            }

            // format address
            const address = formatAddress(this.props.user);

            // send notification to HQ
            await this.notifyHQ(this.props.quote, address, this.props.isChangeOrder);

            // send notification to customer
            await this.notifyCustomer(order, address, this.props.isChangeOrder);

            // if a vendor created this quote, then notify the vendor
            if (this.props.quote.vendor) await this.notifyVendor(this.props.quote.vendor, order, this.props.isChangeOrder);

            // get updated quotes
            await this.props.getQuotes(`status=pending approval&page=1&limit=50`);

            // get pending orders
            await this.props.getOrders(`status=pending&start=none&end=${new Date(moment().add(1, 'year'))}`);

            // reset change orders
            await this.props.resetChangeOrders();

            // iterate through order list
            await this.props.orders.list.forEach(async (o) => {

                // get pending change orders
                await this.props.getChangeOrders(`order=${o._id}&status=pending approval`);
            })

            // navigate user to approved screen
            await this.props.onApproved();
        }

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    async notifyHQ(quote, address, changeOrder) {
        // send slack notification to HQ
        await this.props.sendAlert({
            channel: 'conversions',
            text: `*New Conversion!* \n${this.props.user.first_name} ${this.props.user.last_name}\n${address}\nTitle: "${(changeOrder) ? 'Change Order' : quote.title}"\nDescription: "${quote.description}"`
        })
    }

    async notifyVendor(vendor, order, changeOrder) {
        const vendorMessage = (changeOrder) ?
            `Greetings from Yarden! Your change order has been approved for ${order.customer.address}, ${order.customer.city}, ${order.customer.state}. Log in to your Yarden dashboard to view the details.` :
            `Greetings from Yarden! You have been assigned a new work order scheduled for ${moment(order.date).format("MM-DD-YYYY")} in ${order.customer.city}, ${order.customer.state}. Log in to your Yarden dashboard to view the details.`;

        const messageSubject = (changeOrder) ?
            `Yarden - Change order approved` :
            `Yarden - New work order`;

        const messageLabel = (changeOrder) ?
            `Change Order Approval` :
            `Order Assignment`;

        const notification = {
            email: vendor.email,
            subject: messageSubject,
            label: messageLabel,
            body: (
                `<p>${vendorMessage}</p>`
            )
        }

        // send email notification to vendor
        await this.props.sendEmail(notification);

        const sms = {
            from: '8888289287',
            to: vendor.phone_number.replace(/\D/g, ''),
            body: vendorMessage
        }

        // send sms notification to vendor
        await this.props.sendSms(sms);
    }

    async notifyCustomer(order, address, changeOrder) {
        let customerMessage;

        // if not a change order {...}
        if (!changeOrder) {

            // format customer message for regular quote
            customerMessage = (
                '<p>Hello <b>' + this.props.user.first_name + '</b>,</p>' +
                '<p>Your order has been confirmed, if you have any questions please let us know!</p>' +
                '<table style="margin: 0 auto;" width="600px" cellspacing="0" cellpadding="0" border="0">' +
                '<tr>' +
                '<td>' +
                '<p style="margin-bottom: 0px"><b>Date</b></p>' +
                '</td>' +
                '<td>' +
                '<p style="margin-bottom: 0px"><em>' + moment(order.date).format("MM-DD-YYYY") + '</em></p>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>' +
                '<p style="margin-bottom: 0px"><b>Time</b></p>' +
                '</td>' +
                '<td>' +
                '<p style="margin-bottom: 0px"><em>' + moment(order.time, `HH:mm:ss`).format(`h:mm A`) + '</em></p>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>' +
                '<p style="margin-bottom: 0px"><b>Service</b></p>' +
                '</td>' +
                '<td>' +
                '<p style="margin-bottom: 0px"><em>' + order.description + '</em></p>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>' +
                '<p style="margin-bottom: 0px"><b>Full Name</b></p>' +
                '</td>' +
                '<td>' +
                '<p style="margin-bottom: 0px"><em>' + this.props.user.first_name + ' ' + this.props.user.last_name + '</em></p>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>' +
                '<p style="margin-bottom: 0px"><b>Email</b></p>' +
                '</td>' +
                '<td>' +
                '<p style="margin-bottom: 0px"><em>' + this.props.user.email + '</em></p>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>' +
                '<p style="margin-bottom: 0px"><b>Phone Number</b></p>' +
                '</td>' +
                '<td>' +
                '<p style="margin-bottom: 0px"><em>' + this.props.user.phone_number + '</em></p>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>' +
                '<p style="margin-bottom: 0px"><b>Address</b></p>' +
                '</td>' +
                '<td>' +
                '<p style="margin-bottom: 0px"><em>' + address + '</em></p>' +
                '</td>' +
                '</tr>' +
                '</table>'
            )
        } else {

            // format customer message for change order
            customerMessage = (
                '<p>Hello <b>' + this.props.user.first_name + '</b>,</p>' +
                `<p>Your change order has been confirmed, Log in to your Yarden app to view the details.</p>`
            );
        }

        // format message subject
        const messageSubject = (changeOrder) ?
            `Yarden - Your change order has been approved` :
            `Yarden - Your service has been scheduled`;

        // format message label
        const messageLabel = (changeOrder) ?
            'Change Order Confirmation' :
            'Order Confirmation';

        // format email info
        const email = {
            email: this.props.user.email,
            subject: messageSubject,
            label: messageLabel,
            body: customerMessage
        }

        // send customer confirmation email
        await this.props.sendEmail(email);
    }

    render() {
        const {
            userSignature,
            eSignatureAgreement,
            isOpen,
            isLoading
        } = this.state;

        const {
            quote
        } = this.props;

        const q = calculateQuoteCost(quote.line_items);

        return (
            <View>
                {/* loading indicator */}
                <LoadingIndicator
                    loading={isLoading}
                />

                {/* agreement modal */}
                <ElectronicSignatureAgreement
                    isOpen={isOpen}
                    close={() => this.setState({ isOpen: false })}
                />

                {/* approval start */}
                <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                    <Text style={{ marginBottom: 12 }}>
                        By signing, I agree to pay the full amount of ${delimit(((q.materialsTotal + (q.materialsTotal * vars.tax.ca) + (q.laborTotal + q.deliveryTotal + q.rentalTotal + q.disposalTotal)) + ((((q.materialsTotal + q.laborTotal + q.deliveryTotal + q.rentalTotal + q.disposalTotal) + (q.materialsTotal * vars.tax.ca)) * vars.fees.payment_processing))).toFixed(2))} to {getCompanyName()} for all work listed in section (1a) of this contract.
                        I agree to pay the first payment of ${delimit(((q.materialsTotal + q.deliveryTotal + q.rentalTotal + q.disposalTotal) + (q.materialsTotal * vars.tax.ca) + (((q.materialsTotal + q.deliveryTotal + q.rentalTotal + q.disposalTotal) + (q.materialsTotal * vars.tax.ca)) * vars.fees.payment_processing)).toFixed(2))} today {moment().format('MM/DD/YYYY')}, and a second payment of ${delimit((q.laborTotal + (q.laborTotal * vars.fees.payment_processing)).toFixed(2))} once all work has been completed.
                    </Text>
                    <Divider />
                    <Text style={{ marginTop: 12, textDecorationLine: 'underline' }}>Scope of Work (1a)</Text>
                    <Text style={{ marginBottom: 12 }}>{quote.title} - {quote.description}</Text>
                    <Divider />
                    <View>
                        <Text style={{ marginTop: 12 }}>Add your e-signature to approve the quote</Text>
                        <Input
                            onChange={(value) => this.setState({ userSignature: value })}
                            value={userSignature}
                            placeholder="Full Name"
                        />
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <CheckBox
                            value={eSignatureAgreement}
                            onValueChange={() => this.setState({ eSignatureAgreement: !eSignatureAgreement })}
                            boxType="square"
                        />
                        <View style={{ paddingLeft: 12, paddingRight: 12 }}>
                            <Text>By checking this box, you agree to the <Link onPress={() => this.setState({ isOpen: true })} text="Electronic Record and Signature Disclosure"></Link></Text>
                        </View>
                    </View>
                    <View>
                        <Button
                            text="Approve"
                            onPress={() => this.approve()}
                            disabled={!userSignature || !eSignatureAgreement}
                            variant="primary"
                        />
                    </View>
                </View>
                {/* approval end */}

            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        orders: state.orders
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        chargeCard,
        getIP,
        createApproval,
        createOrder,
        getOrders,
        updateQuote,
        getQuotes,
        sendAlert,
        sendEmail,
        updateUser,
        updateChangeOrder,
        getChangeOrders,
        resetChangeOrders
    }, dispatch)
}

Approval = connect(mapStateToProps, mapDispatchToProps)(Approval);

export default Approval;

module.exports = Approval;