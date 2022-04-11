import React, { Component } from 'react';
import { View } from 'react-native';
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
import Paragraph from '../../components/UI/Paragraph';
import { alert } from '../../components/UI/SystemAlert';
import Card from '../../components/UI/Card';
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
import { createQuote, updateQuote, getQuotes } from '../../actions/quotes/index';
import { sendAlert } from '../../actions/alerts/index';
import { sendEmail } from '../../actions/emails/index';
import { updateUser, getUser } from '../../actions/user/index';
import { sendSms } from '../../actions/sms/index';
import { updateChangeOrder, getChangeOrders, resetChangeOrders } from '../../actions/changeOrders/index';
import { createPurchase } from '../../actions/purchases/index';
import formatMaterials from '../../helpers/formatMaterials';
import minifyDataToID from '../../helpers/minifyDataToID';
import combinePlants from '../../helpers/combinePlants';
import units from '../../components/styles/units';

class Approval extends Component {

    state = {}

    async componentDidMount() {

        // get user info
        // NOTE: We need to do this to ensure that the user info is up-to-date before processing (example: if Yarden uploads new garden from web platform, system will add new gardens to garden_info - but the app won't be aware of these changes unless we fetch the users data)
        await this.props.getUser(this.props.user._id);

        // if plant selections {...}
        if (this.props.plantSelections) {

            // combine plants from selection
            const combinedPlants = combinePlants(this.props.plantSelections);

            // if user has garden info {...}
            if (this.props.user.garden_info) {

                // set current plants
                const currentVegetables = minifyDataToID(this.props.user.garden_info.vegetables);
                const currentFruit = minifyDataToID(this.props.user.garden_info.fruit);
                const currentHerbs = minifyDataToID(this.props.user.garden_info.herbs);

                // set initial updated plants
                let newVegetables = [];
                let newFruit = [];
                let newHerbs = [];

                // set initial combined plants
                let currentAndNewVegetables = [];
                let currentAndNewFruit = [];
                let currentAndNewHerbs = [];

                // if current vegetables {...}
                if (currentVegetables) {

                    // iterate through vegetables
                    combinedPlants.vegetables.forEach((vegetable) => {

                        // only add new vegetables that don't already exist
                        const alreadyExists = currentVegetables.find((veg) => veg === vegetable);
                        if (!alreadyExists) newVegetables.push(vegetable);

                    })

                    // combine current and new vegetables
                    currentAndNewVegetables = currentVegetables.concat(newVegetables);

                }

                // if current fruit {...}
                if (currentFruit) {

                    // iterate through fruit
                    combinedPlants.fruit.forEach((fr) => {

                        // only add new fruit that don't already exist
                        const alreadyExists = currentFruit.find((frt) => frt === fr);
                        if (!alreadyExists) newFruit.push(fr);

                    })

                    // combine current and new fruit
                    currentAndNewFruit = currentFruit.concat(newFruit);
                }

                // if current herbs {...}
                if (currentHerbs) {

                    // iterate through herbs
                    combinedPlants.herbs.forEach((herb) => {

                        // only add new herbs that don't already exist
                        const alreadyExists = currentHerbs.find((h) => h === herb);
                        if (!alreadyExists) newHerbs.push(herb);

                    })

                    // combine current and new herbs
                    currentAndNewHerbs = currentHerbs.concat(newHerbs);
                }

                this.setState({
                    vegetables: currentAndNewVegetables,
                    herbs: currentAndNewHerbs,
                    fruit: currentAndNewFruit
                })
            } else {
                this.setState({
                    vegetables: combinedPlants.vegetables,
                    herbs: combinedPlants.herbs,
                    fruit: combinedPlants.fruit
                })
            }
        }

        // if multiple quotes {...}
        if (this.props.quotes) {
            let materialsTotal = 0;
            let laborTotal = 0;
            let rentalTotal = 0;
            let deliveryTotal = 0;
            let disposalTotal = 0;

            this.props.quotes.forEach((quote) => {
                const q = calculateQuoteCost(quote.line_items);
                materialsTotal += q.materialsTotal;
                laborTotal += q.laborTotal;
                rentalTotal += q.rentalTotal;
                deliveryTotal += q.deliveryTotal;
                disposalTotal += q.disposalTotal;
            })

            this.setState({
                materialsTotal,
                laborTotal,
                rentalTotal,
                deliveryTotal,
                disposalTotal
            })
        } else { // if single quote {...}
            const { quote } = this.props;
            const q = calculateQuoteCost(quote.line_items);
            this.setState({
                materialsTotal: q.materialsTotal,
                laborTotal: q.laborTotal,
                rentalTotal: q.rentalTotal,
                deliveryTotal: q.deliveryTotal,
                disposalTotal: q.disposalTotal
            })
        }
    }

    minifyDataToArray(data) {
        let plants = [];

        // iterate through plants
        for (let v in data) {

            // iterate through plant classes
            data[v].forEach((d) => {

                // add to plant list
                plants.push(d);
            })
        }

        return plants;
    }

    getPlantsList(quote) {
        // get plant selection
        const plantSelection = this.props.plantSelections.find((selection) => selection.quoteTitle === quote.title);

        // minify data to array
        const vegetables = this.minifyDataToArray(plantSelection.vegetables);
        const fruit = this.minifyDataToArray(plantSelection.fruit);
        const herbs = plantSelection.herbs;

        return {
            vegetables,
            fruit,
            herbs
        }
    }

    async scheduleNewOrder(approval, quote, isGarden) {

        // format new order
        let newOrder = {
            customer: this.props.user._id,
            approval: approval._id,
            type: (quote.type) ? quote.type : 'misc',
            date: moment().add(2, 'weeks'),
            time: '10',
            description: quote.description,
            bid: quote._id
        }

        // if new order is for a garden {...}
        if (isGarden) {

            // set project phase to 1
            newOrder.phase = 1;
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

        // calculate total quote cost
        const amount = (((this.state.materialsTotal + this.state.deliveryTotal + this.state.rentalTotal + this.state.disposalTotal) + (this.state.materialsTotal * vars.tax.ca)) + (((this.state.materialsTotal + this.state.deliveryTotal + this.state.rentalTotal + this.state.disposalTotal) + (this.state.materialsTotal * vars.tax.ca)) * vars.fees.payment_processing));

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
            const approvalImage = await uploadImage(screenshot, 'approval.jpg');

            // format new approval
            const newApproval = {
                image: approvalImage,
                location: ip.data
            }

            // create approval
            const approval = await this.props.createApproval(newApproval);

            // set empty order
            let order = {};

            if (this.props.isChangeOrder) { // if approval is for a change order {...}

                // update change order as "approved"
                await this.props.updateChangeOrder(this.props.quote._id, { status: 'approved', approval: approval._id });

                // assign order value
                order = this.props.quote.order;
            } if (this.props.isPurchase) { // if approval is for a purchase {...}

                // if plant selections {...}
                if (this.props.plantSelections) {

                    // update garden info
                    await this.updateGardenInfo(this.state.vegetables, this.state.fruit, this.state.herbs);
                }

                // process purchase
                return this.processPurchase(approval);
            } else {
                // set initial quote update
                let updatedQuote = { status: 'approved' };

                // check to see if the quote is for a garden
                const isGarden = (this.props.quote.product.type.name === 'garden');

                // if garden quote {...}
                if (isGarden) {

                    // get plant selection
                    const plantList = this.getPlantsList(this.props.quote);

                    // get plant selection
                    let lineItems = this.props.quote.line_items;

                    // add plants to line items
                    lineItems.vegetables = minifyDataToID(plantList.vegetables);
                    lineItems.herbs = minifyDataToID(plantList.herbs);
                    lineItems.fruit = minifyDataToID(plantList.fruit);
                    updatedQuote.line_items = lineItems;

                    // update garden info
                    await this.updateGardenInfo(lineItems.vegetables, lineItems.fruit, lineItems.herbs);
                }

                // update quote as "approved"
                await this.props.updateQuote(this.props.quote._id, updatedQuote);

                // schedule a new order
                order = await this.scheduleNewOrder(approval, this.props.quote, isGarden);
            }

            this.finish(order);
        }
    }

    async updateGardenInfo(vegetables, fruit, herbs) {
        let gardenInfo = {
            vegetables,
            fruit,
            herbs
        };

        // if user has garden info {...}
        if (this.props.user.garden_info) {

            // if user already has a maintenance plan, set plan
            if (this.props.user.garden_info.maintenance_plan) gardenInfo.maintenance_plan = this.props.user.garden_info.maintenance_plan;

            // if user already has beds, set beds
            if (this.props.user.garden_info.beds) gardenInfo.beds = this.props.user.garden_info.beds;

            // if user already has accessories, set accessories
            if (this.props.user.garden_info.accessories) gardenInfo.accessories = this.props.user.garden_info.accessories;
        } else {
            // if user selected a new plan, set plan
            if (this.props.plan) gardenInfo.maintenance_plan = this.props.plan;
        }

        // update user with garden info
        await this.props.updateUser(null, { gardenInfo });
    }

    async notifyHQ(quote, address, changeOrder) {
        // send slack notification to HQ
        await this.props.sendAlert({
            channel: 'conversions',
            text: `*New Conversion!* \n${this.props.user.first_name} ${this.props.user.last_name}\n${address}\nTitle: "${(changeOrder) ? 'Change Order' : quote.title}"\nDescription: "${quote.description}"`
        })
    }

    async notifyVendor(vendor, date, address, changeOrder) {
        const vendorMessage = (changeOrder) ?
            `Greetings from Yarden! Your change order has been approved for ${address}. Log in to your Yarden dashboard to view the details.` :
            `Greetings from Yarden! You have been assigned a new work order scheduled for ${moment(date).format("MM-DD-YYYY")} at ${address}. Log in to your Yarden dashboard to view the details.`;

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

    async notifyCustomer(order, address, changeOrder, purchase) {

        // set initial message, subject, and label
        let customerMessage, messageSubject, messageLabel;

        if (changeOrder) { // if change order {...}

            // format notification for change order
            messageSubject = `Yarden - Your change order has been approved`;
            messageLabel = 'Change Order Confirmation';
            customerMessage = (
                '<p>Hello <b>' + this.props.user.first_name + '</b>,</p>' +
                `<p>Your change order has been confirmed, log in to your Yarden app to view the details.</p>`
            );
        } else if (purchase) { // if purchase {...}

            // format notification for purchase
            messageSubject = `Yarden - Purchase confirmation`;
            messageLabel = 'Purchase Confirmation';
            customerMessage = (
                '<p>Hello <b>' + this.props.user.first_name + '</b>,</p>' +
                `<p>Your purchase was successful, log in to your Yarden app to view the details.</p>`
            );
        } else {

            // format notification for order
            messageSubject = `Yarden - Your service has been scheduled`;
            messageLabel = 'Order Confirmation';
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
        }

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

    async processPurchase(approval) {

        // iterate through quotes
        await this.props.quotes.forEach(async (quote, index) => {

            // set initial quote data
            let data = quote;

            // format quote materials
            data.line_items.materials = await formatMaterials(quote.line_items.materials);

            // set quote estimated start date
            const startDate = moment().add(2, 'weeks').startOf('day');
            data.estimated_start_dt = startDate;

            // check to see if the purchase is for a garden
            const isGarden = (quote.product.type.name === 'garden');

            // check to see if the purchase is for an accessory
            const isAccessory = (quote.product.type.name === 'accessory');

            // if garden purchase {...}
            if (isGarden) {

                // get plant selection
                const plantList = this.getPlantsList(quote);

                // set plant selection
                data.line_items.vegetables = minifyDataToID(plantList.vegetables);
                data.line_items.herbs = minifyDataToID(plantList.herbs);
                data.line_items.fruit = minifyDataToID(plantList.fruit);

                // if product category is "potted plants" {...}
                if (quote.product.category.name === 'potted plants') {

                    let accessories = [];

                    // iterate through product variants
                    quote.product.variants.forEach((variant) => {

                        // add variant to accessories list
                        accessories.push({
                            name: variant.name,
                            width: variant.dimensions.width,
                            length: variant.dimensions.length,
                            height: variant.dimensions.height,
                            qty: variant.qty
                        });
                    })

                    // set accessories in line items
                    data.line_items.accessories = accessories;
                }
            }

            // if accessory purchase {...}
            if (isAccessory) {

                let accessories = [];

                // iterate through product variants
                quote.product.variants.forEach((variant) => {

                    // add variant to accessories list
                    accessories.push({
                        name: variant.name,
                        width: variant.dimensions.width,
                        length: variant.dimensions.length,
                        height: variant.dimensions.height,
                        qty: variant.qty
                    });
                })

                // set accessories in line items
                data.line_items.accessories = accessories;
            }

            // create quote
            const q = await this.props.createQuote(data);

            // schedule a new order
            const newOrder = await this.scheduleNewOrder(approval, q, isGarden);

            // create purchase record
            await this.props.createPurchase({ customer: this.props.user._id, order: newOrder._id })

            // if last iteration of loop, finish processing
            if (index === this.props.quotes.length - 1) {
                this.finish();
            }
        })
    }

    async finish(order) {

        // format address
        const address = formatAddress(this.props.user);

        // send notification to HQ
        await this.notifyHQ(
            this.props.quote,
            address,
            this.props.isChangeOrder
        );

        // send notification to customer
        await this.notifyCustomer(
            order,
            address,
            this.props.isChangeOrder,
            this.props.isPurchase
        );

        // if a vendor created this quote {...}
        if (this.props.quote.vendor) {

            // notify vendor
            await this.notifyVendor(
                this.props.quote.vendor,
                order.date,
                address,
                this.props.isChangeOrder
            );
        }

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

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    render() {
        const {
            userSignature,
            eSignatureAgreement,
            isOpen,
            isLoading,
            materialsTotal,
            laborTotal,
            rentalTotal,
            deliveryTotal,
            disposalTotal
        } = this.state;

        const {
            quote
        } = this.props;

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
                <View>
                    <Paragraph style={{ marginBottom: units.unit5 }}>
                        By signing, I agree to pay the full amount of ${delimit(((materialsTotal + (materialsTotal * vars.tax.ca) + (laborTotal + deliveryTotal + rentalTotal + disposalTotal)) + ((((materialsTotal + laborTotal + deliveryTotal + rentalTotal + disposalTotal) + (materialsTotal * vars.tax.ca)) * vars.fees.payment_processing))).toFixed(2))} to {getCompanyName()} for all work listed in section (1a) "Scope of Work" of this contract.
                        I agree to pay the first payment of ${delimit(((materialsTotal + deliveryTotal + rentalTotal + disposalTotal) + (materialsTotal * vars.tax.ca) + (((materialsTotal + deliveryTotal + rentalTotal + disposalTotal) + (materialsTotal * vars.tax.ca)) * vars.fees.payment_processing)).toFixed(2))} today {moment().format('MM/DD/YYYY')}, and a second payment of ${delimit((laborTotal + (laborTotal * vars.fees.payment_processing)).toFixed(2))} once all work has been completed.
                    </Paragraph>
                    <Divider />
                    <Paragraph style={{ marginTop: units.unit5, textDecorationLine: 'underline' }}>Scope of Work (1a)</Paragraph>
                    <Paragraph style={{ marginBottom: units.unit5 }}>{quote.title} - {quote.description}</Paragraph>
                    <Divider />
                    <View>
                        <Paragraph style={{ marginTop: units.unit5 }}>Add your e-signature to approve the quote</Paragraph>
                        <Input
                            onChange={(value) => this.setState({ userSignature: value })}
                            value={userSignature}
                            placeholder="Full Name"
                        />
                    </View>
                    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                        <CheckBox
                            value={eSignatureAgreement}
                            onValueChange={() => this.setState({ eSignatureAgreement: !eSignatureAgreement })}
                            boxType="square"
                        />
                        <View style={{ paddingLeft: units.unit5, paddingRight: units.unit5 }}>
                            <Paragraph>By checking this box, you agree to the <Link onPress={() => this.setState({ isOpen: true })} text="Electronic Record and Signature Disclosure"></Link></Paragraph>
                        </View>
                    </View>
                    <View style={{marginTop: units.unit4}}>
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
        orders: state.orders,
        items: state.items
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        chargeCard,
        getIP,
        createApproval,
        createOrder,
        getOrders,
        createQuote,
        updateQuote,
        getQuotes,
        sendAlert,
        sendEmail,
        updateUser,
        updateChangeOrder,
        getChangeOrders,
        resetChangeOrders,
        sendSms,
        createPurchase,
        getUser
    }, dispatch)
}

Approval = connect(mapStateToProps, mapDispatchToProps)(Approval);

export default Approval;

module.exports = Approval;