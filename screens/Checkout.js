// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import CheckBox from '@react-native-community/checkbox';

// vars
import vars from '../vars/index';
import types from '../vars/types';

// UI components
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import Link from '../components/UI/Link';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import { alert } from '../components/UI/SystemAlert';
import ElectronicSignatureAgreement from '../components/app/ElectronicSignatureAgreement';
import PaymentMethod from '../components/app/PaymentMethod';
import Header from '../components/UI/Header';
import Label from '../components/UI/Label';
import Card from '../components/UI/Card';

// helpers
import calculateQuoteCost from '../helpers/calculateQuote';
import delimit from '../helpers/delimit';
import getCompanyName from '../helpers/getCompanyName';
import getScreenShot from '../helpers/getScreenShot';
import uploadImage from '../helpers/uploadImage';
import formatAddress from '../helpers/formatAddress';
import formatMaterials from '../helpers/formatMaterials';
import minifyDataToID from '../helpers/minifyDataToID';
import combinePlants from '../helpers/combinePlants';
import clearCart from '../helpers/clearCart';

// actions
import { chargeCard } from '../actions/cards/index';
import { getIP } from '../actions/location/index';
import { createApproval } from '../actions/approvals/index';
import { createOrder, getOrders } from '../actions/orders/index';
import { createQuote, updateQuote, getQuotes } from '../actions/quotes/index';
import { sendAlert } from '../actions/alerts/index';
import { sendEmail } from '../actions/emails/index';
import { getUser, updateUser } from '../actions/user/index';
import { sendSms } from '../actions/sms/index';
import {
  updateChangeOrder,
  getChangeOrders,
  resetChangeOrders,
} from '../actions/changeOrders/index';
import { createPurchase } from '../actions/purchases/index';
import { getItems } from '../actions/items/index';

// styles
import units from '../components/styles/units';
import fonts from '../components/styles/fonts';
import colors from '../components/styles/colors';

class Checkout extends Component {
  state = {};

  async componentDidMount() {
    // get user info
    // NOTE: We need to do this to ensure that the user info is up-to-date before processing (example: if Yarden uploads new garden from web platform, system will add new gardens to garden_info - but the app won't be aware of these changes unless we fetch the users data)
    // author: Isaac G. 2/25/23
    await this.props.getUser(this.props.user._id);

    // if plant selections (i.e Installation or Revive) {...}
    if (this.props.route.params.plantSelections) {

      // combine plants from selection
      const combinedPlants = combinePlants(
        this.props.route.params.plantSelections,
      );

      // update plant list
      this.setState({
        vegetables: combinedPlants.vegetables,
        herbs: combinedPlants.herbs,
        fruit: combinedPlants.fruit,
      });
    }

    // if multiple quotes {...}
    if (this.props.route.params.quotes) {
      let materialsTotal = 0;
      let laborTotal = 0;
      let rentalTotal = 0;
      let deliveryTotal = 0;
      let disposalTotal = 0;

      this.props.route.params.quotes.forEach(quote => {
        const q = calculateQuoteCost(quote.line_items);
        materialsTotal += q.materialsTotal;
        laborTotal += q.laborTotal;
        rentalTotal += q.rentalTotal;
        deliveryTotal += q.deliveryTotal;
        disposalTotal += q.disposalTotal;
      });

      this.setState({
        materialsTotal,
        laborTotal,
        rentalTotal,
        deliveryTotal,
        disposalTotal,
      });
    } else {
      // if single quote {...}
      const quote = this.props.route.params;
      const q = calculateQuoteCost(quote.line_items);
      this.setState({
        materialsTotal: q.materialsTotal,
        laborTotal: q.laborTotal,
        rentalTotal: q.rentalTotal,
        deliveryTotal: q.deliveryTotal,
        disposalTotal: q.disposalTotal,
      });
    }
  }

  async onApproved() {
    // clear cart
    await clearCart(this.props.items);

    // get updated item list
    await this.props.getItems();

    // navigate to approved page
    this.props.navigation.navigate('Approved');
  }

  minifyDataToArray(data) {
    let plants = [];

    // iterate through plants
    for (let v in data) {
      // iterate through plant classes
      data[v].forEach(d => {
        // add to plant list
        plants.push(d);
      });
    }

    return plants;
  }

  getPlantsList(quote) {
    // get plant selection
    const plantSelection = this.props.route.params.plantSelections.find(
      selection => selection.quoteTitle === quote.title,
    );

    // minify data to array
    const vegetables = this.minifyDataToArray(plantSelection.vegetables);
    const fruit = this.minifyDataToArray(plantSelection.fruit);
    const herbs = plantSelection.herbs;

    return {
      vegetables,
      fruit,
      herbs,
    };
  }

  async scheduleNewOrder(approval, quote, isGarden) {
    // format new order
    let newOrder = {
      customer: this.props.user._id,
      approval: approval._id,
      type: quote.type ? quote.type : 'misc',
      date: moment().add(2, 'weeks'),
      time: '10',
      description: quote.description,
      bid: quote._id,
    };

    // if new order is for a garden {...}
    if (isGarden) {
      // set project phase to 1
      newOrder.phase = 1;
    }

    // if a vendor created this quote, then set the order assignment to this vendor
    if (this.props.route.params.vendor)
      newOrder.vendor = this.props.route.params.vendor._id;

    // create work order
    const order = await this.props.createOrder(newOrder);

    // return value
    return order;
  }

  async approve() {
    // if no payment method, show error
    if (!this.props.user.payment_info)
      return alert('Please add a payment method');

    // take screenshot (proof of approval agreement)
    const screenshot = await getScreenShot();

    // show loading indicator
    this.setState({ isLoading: true });

    // set initial quote update
    let updatedQuote = { status: 'approved' };

    // check to see if the quote is for a new garden bed
    const isGarden =
      this.props.route.params.type === types.INSTALLATION ||
      this.props.route.params.type === types.REVIVE

    // calculate total quote cost
    const amount =
      this.state.materialsTotal +
      this.state.deliveryTotal +
      this.state.rentalTotal +
      this.state.disposalTotal +
      this.state.materialsTotal * vars.tax.ca +
      (this.state.materialsTotal +
        this.state.deliveryTotal +
        this.state.rentalTotal +
        this.state.disposalTotal +
        this.state.materialsTotal * vars.tax.ca) *
      vars.fees.payment_processing;

    // format from dollars to cents
    const total = parseFloat(amount).toFixed(2) * 100;

    if (total > 0) {
      // format payment description for materials
      const description = `Materials - ${this.props.route.params.description}`;

      // format payment
      const payment = {
        amount: total,
        currency: 'usd',
        description: description,
        statement_descriptor_suffix: `Materials`,
      };

      // charge card
      await this.props.chargeCard(payment);
    }

    // get user IP (proof of location at time of approval)
    const ip = await this.props.getIP();

    // save screenshot of approval image
    const approvalImage = await uploadImage(screenshot, 'approval.jpg');

    // format new approval
    const newApproval = {
      image: approvalImage,
      location: ip.data,
    };

    // create approval
    const approval = await this.props.createApproval(newApproval);

    // set empty order
    let order = {};

    if (this.props.route.params.isChangeOrder) {
      // if approval is for a change order {...}

      // update change order as "approved"
      await this.props.updateChangeOrder(this.props.route.params._id, {
        status: 'approved',
        approval: approval._id,
      });

      // assign order value
      order = this.props.route.params.order;
    } else if (this.props.route.params.isPurchase) {
      // process purchase
      return this.processPurchase(approval.data);
    } else {
      // if garden quote {...}
      if (isGarden) {

        // get plant selection
        let lineItems = this.props.route.params.line_items;

        // combine plants from selection
        const combinedPlants = combinePlants(
          this.props.route.params.plantSelections,
        );

        let beds = lineItems.beds;
        beds.forEach((bed) => {
          bed.shape = bed.shape._id;
        })

        // set line items
        lineItems.beds = beds;
        lineItems.vegetables = combinedPlants.vegetables;
        lineItems.herbs = combinedPlants.herbs;
        lineItems.fruit = combinedPlants.fruit;
        updatedQuote.line_items = lineItems;

        // if user selected a new plan {...}
        if (this.props.route.params.plan) {

          // get current garden info
          let gardenInfo = (this.props.user.garden_info) ? this.props.user.garden_info : {};

          // set new maintenance plan
          gardenInfo.maintenance_plan = this.props.route.params.plan;

          // update user garden info
          await this.props.updateUser(this.props.user._id, { gardenInfo });
        }
      }
    }

    // update quote as "approved"
    await this.props.updateQuote(this.props.route.params._id, updatedQuote);

    // schedule a new order
    order = await this.scheduleNewOrder(
      approval.data,
      this.props.route.params,
      isGarden
    );

    this.finish(order);
  }

  async notifyHQ(quote, address, changeOrder) {
    // send slack notification to HQ
    await this.props.sendAlert({
      channel: 'conversions',
      text: `*New Conversion!* \n${this.props.user.first_name} ${this.props.user.last_name
        }\n${address}\nTitle: "${changeOrder ? 'Change Order' : quote.title
        }"\nDescription: "${quote.description}"`,
    });
  }

  async notifyVendor(vendor, date, address, changeOrder) {
    const vendorMessage = changeOrder
      ? `Greetings from Yarden! Your change order has been approved for ${address}. Log in to your Yarden dashboard to view the details.`
      : `Greetings from Yarden! You have been assigned a new work order scheduled for ${moment(
        date,
      ).format(
        'MM-DD-YYYY',
      )} at ${address}. Log in to your Yarden dashboard to view the details.`;

    const messageSubject = changeOrder
      ? `Yarden - Change order approved`
      : `Yarden - New work order`;

    const messageLabel = changeOrder
      ? `Change Order Approval`
      : `Order Assignment`;

    const notification = {
      email: vendor.email,
      subject: messageSubject,
      label: messageLabel,
      body: `<p>${vendorMessage}</p>`,
    };

    // send email notification to vendor
    await this.props.sendEmail(notification);

    const sms = {
      from: '8888289287',
      to: vendor.phone_number.replace(/\D/g, ''),
      body: vendorMessage,
    };

    // send sms notification to vendor
    await this.props.sendSms(sms);
  }

  async notifyCustomer(order, address, changeOrder, purchase) {
    // set initial message, subject, and label
    let customerMessage, messageSubject, messageLabel;

    if (changeOrder) {
      // if change order {...}

      // format notification for change order
      messageSubject = `Yarden - Your change order has been approved`;
      messageLabel = 'Change Order Confirmation';
      customerMessage =
        '<p>Hello <b>' +
        this.props.user.first_name +
        '</b>,</p>' +
        `<p>Your change order has been confirmed, log in to your Yarden app to view the details.</p>`;
    } else if (purchase) {
      // if purchase {...}

      // format notification for purchase
      messageSubject = `Yarden - Purchase confirmation`;
      messageLabel = 'Purchase Confirmation';
      customerMessage =
        '<p>Hello <b>' +
        this.props.user.first_name +
        '</b>,</p>' +
        `<p>Your purchase was successful, log in to your Yarden app to view the details.</p>`;
    } else {
      // format notification for order
      messageSubject = `Yarden - Your service has been scheduled`;
      messageLabel = 'Order Confirmation';
      customerMessage =
        '<p>Hello <b>' +
        this.props.user.first_name +
        '</b>,</p>' +
        '<p>Your order has been confirmed, log in to your Yarden app to view the details.</p>' +
        '<table style="margin: 0 auto;" width="600px" cellspacing="0" cellpadding="0" border="0">' +
        '<tr>' +
        '<td>' +
        '<p style="margin-bottom: 0px"><b>Date</b></p>' +
        '</td>' +
        '<td>' +
        '<p style="margin-bottom: 0px"><em>' +
        moment(order.date).format('MM-DD-YYYY') +
        '</em></p>' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>' +
        '<p style="margin-bottom: 0px"><b>Time</b></p>' +
        '</td>' +
        '<td>' +
        '<p style="margin-bottom: 0px"><em>' +
        moment(order.time, `HH:mm:ss`).format(`h:mm A`) +
        '</em></p>' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>' +
        '<p style="margin-bottom: 0px"><b>Service</b></p>' +
        '</td>' +
        '<td>' +
        '<p style="margin-bottom: 0px"><em>' +
        order.description +
        '</em></p>' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>' +
        '<p style="margin-bottom: 0px"><b>Full Name</b></p>' +
        '</td>' +
        '<td>' +
        '<p style="margin-bottom: 0px"><em>' +
        this.props.user.first_name +
        ' ' +
        this.props.user.last_name +
        '</em></p>' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>' +
        '<p style="margin-bottom: 0px"><b>Email</b></p>' +
        '</td>' +
        '<td>' +
        '<p style="margin-bottom: 0px"><em>' +
        this.props.user.email +
        '</em></p>' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>' +
        '<p style="margin-bottom: 0px"><b>Phone Number</b></p>' +
        '</td>' +
        '<td>' +
        '<p style="margin-bottom: 0px"><em>' +
        this.props.user.phone_number +
        '</em></p>' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>' +
        '<p style="margin-bottom: 0px"><b>Address</b></p>' +
        '</td>' +
        '<td>' +
        '<p style="margin-bottom: 0px"><em>' +
        address +
        '</em></p>' +
        '</td>' +
        '</tr>' +
        '</table>';
    }

    // format email info
    const email = {
      email: this.props.user.email,
      subject: messageSubject,
      label: messageLabel,
      body: customerMessage,
    };

    // send customer confirmation email
    await this.props.sendEmail(email);
  }

  async processPurchase(approval) {
    // iterate through quotes
    await this.props.route.params.quotes.forEach(async (quote, index) => {
      // set initial quote data
      let data = quote;

      // format quote materials
      data.line_items.materials = await formatMaterials(
        quote.line_items.materials,
      );

      // set quote estimated start date
      const startDate = moment().add(2, 'weeks').startOf('day');
      data.estimated_start_dt = startDate;

      // check to see if the purchase is for a garden
      const isGarden = quote.product.type.name === 'garden';

      // check to see if the purchase is for an accessory
      const isAccessory = quote.product.type.name === 'accessory';

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
          quote.product.variants.forEach(variant => {
            // add variant to accessories list
            accessories.push({
              name: variant.name,
              width: variant.dimensions.width,
              length: variant.dimensions.length,
              height: variant.dimensions.height,
              qty: variant.qty,
            });
          });

          // set accessories in line items
          data.line_items.accessories = accessories;
        }
      }

      // if accessory purchase {...}
      if (isAccessory) {
        let accessories = [];

        // iterate through product variants
        quote.product.variants.forEach(variant => {
          // add variant to accessories list
          accessories.push({
            name: variant.name,
            width: variant.dimensions.width,
            length: variant.dimensions.length,
            height: variant.dimensions.height,
            qty: variant.qty,
          });
        });

        // set accessories in line items
        data.line_items.accessories = accessories;
      }

      // create quote
      const q = await this.props.createQuote(data);

      // schedule a new order
      const newOrder = await this.scheduleNewOrder(approval, q, isGarden);

      // create purchase record
      await this.props.createPurchase({
        customer: this.props.user._id,
        order: newOrder._id,
      });

      // if last iteration of loop, finish processing
      if (index === this.props.route.params.quotes.length - 1) {
        this.finish();
      }
    });
  }

  async finish(order) {
    // format address
    const address = formatAddress(this.props.user);

    // send notification to HQ
    await this.notifyHQ(
      this.props.route.params,
      address,
      this.props.route.params.isChangeOrder,
    );

    // send notification to customer
    await this.notifyCustomer(
      order,
      address,
      this.props.route.params.isChangeOrder,
      this.props.route.params.isPurchase,
    );

    // if a vendor created this quote {...}
    if (this.props.route.params.vendor) {
      // notify vendor
      await this.notifyVendor(
        this.props.route.params.vendor,
        order.date,
        address,
        this.props.route.params.isChangeOrder,
      );
    }

    // get updated quotes
    await this.props.getQuotes(`status=pending approval&page=1&limit=50`);

    // get pending orders
    await this.props.getOrders(
      `status=pending&start=none&end=${new Date(moment().add(1, 'year'))}`,
    );

    // reset change orders
    await this.props.resetChangeOrders();

    // iterate through order list
    await this.props.orders.list.forEach(async o => {
      // get pending change orders
      await this.props.getChangeOrders(
        `order=${o._id}&status=pending approval`,
      );
    });

    // navigate user to approved screen
    await this.onApproved();

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
      disposalTotal,
    } = this.state;

    const quote = this.props.route.params;
    const { user } = this.props;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
        }}>
        <KeyboardAwareScrollView>
          <View style={{ padding: units.unit3 + units.unit4 }}>
            {/* loading indicator */}
            <LoadingIndicator loading={isLoading} />

            <Header type="h4" style={{ marginBottom: units.unit5 }}>
              Checkout
            </Header>
            <Label>Scope of Work (1a)</Label>
            <Text style={{ marginBottom: units.unit5, color: colors.greenD75 }}>
              {quote.title} - {quote.description}
            </Text>
            <View>
              <Label>Payment Method</Label>
              <Card style={{ marginBottom: units.unit5 }}>
                <PaymentMethod />
              </Card>

              {/* approval start */}
              <View>
                {/* agreement modal */}
                <ElectronicSignatureAgreement
                  isOpen={isOpen}
                  close={() => this.setState({ isOpen: false })}
                />
                <View>
                  <View>
                    <Input
                      label="First/last name"
                      onChange={value => this.setState({ userSignature: value })}
                      value={userSignature}
                      placeholder="ex. Jane Doe"
                    />
                    <Text
                      style={{
                        marginVertical: units.unit4,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: colors.greenD75,
                      }}>
                      Add your e-signature to approve the quote
                    </Text>
                    <Text
                      style={{
                        lineHeight: fonts.h2,
                        color: colors.greenE75,
                      }}>
                      By signing, I agree to pay the full amount of{' '}
                      <Text style={{ fontWeight: 'bold' }}>
                        ${delimit(
                          (
                            materialsTotal +
                            materialsTotal * vars.tax.ca +
                            (laborTotal +
                              deliveryTotal +
                              rentalTotal +
                              disposalTotal) +
                            (materialsTotal +
                              laborTotal +
                              deliveryTotal +
                              rentalTotal +
                              disposalTotal +
                              materialsTotal * vars.tax.ca) *
                            vars.fees.payment_processing
                          ).toFixed(2),
                        )}
                      </Text>{' '}
                      to {getCompanyName()} for all work listed in section (1a)
                      "Scope of Work" of this contract. I agree to pay the first
                      payment of{' '}
                      <Text style={{ fontWeight: 'bold' }}>
                        $
                        {delimit(
                          (
                            materialsTotal +
                            deliveryTotal +
                            rentalTotal +
                            disposalTotal +
                            materialsTotal * vars.tax.ca +
                            (materialsTotal +
                              deliveryTotal +
                              rentalTotal +
                              disposalTotal +
                              materialsTotal * vars.tax.ca) *
                            vars.fees.payment_processing
                          ).toFixed(2),
                        )}
                      </Text>{' '}
                      today{' '}
                      <Text style={{ fontWeight: 'bold' }}>
                        {moment().format('MM/DD/YYYY')}
                      </Text>
                      , and a second payment of{' '}
                      <Text style={{ fontWeight: 'bold' }}>
                        ${delimit(
                          (
                            laborTotal +
                            laborTotal * vars.fees.payment_processing
                          ).toFixed(2),
                        )}
                      </Text>{' '}
                      once all work has been completed.
                    </Text>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'row',
                      paddingTop: units.unit5,
                      paddingBottom: units.unit4,
                      paddingLeft: units.unit4,
                    }}>
                    <CheckBox
                      value={eSignatureAgreement}
                      onValueChange={() =>
                        this.setState({
                          eSignatureAgreement: !eSignatureAgreement,
                        })
                      }
                      boxType="square"
                    />
                    <View
                      style={{
                        paddingLeft: units.unit5,
                        paddingRight: units.unit5,
                      }}>
                      <View>
                        <Text>By checking this box, you agree to the </Text>
                        <Link
                          onPress={() => this.setState({ isOpen: true })}
                          text="Electronic Record and Signature Disclosure"></Link>
                      </View>
                    </View>
                  </View>
                  <View style={{ marginTop: units.unit4 }}>
                    <Button
                      text="Approve"
                      onPress={() => this.approve()}
                      disabled={
                        !userSignature ||
                        !eSignatureAgreement ||
                        !user.payment_info
                      }
                      variant="primary"
                    />
                  </View>
                </View>
                {/* approval end */}
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    orders: state.orders,
    items: state.items
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems,
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
      updateChangeOrder,
      getChangeOrders,
      resetChangeOrders,
      sendSms,
      createPurchase,
      getUser,
      updateUser
    },
    dispatch,
  );
}

Checkout = connect(mapStateToProps, mapDispatchToProps)(Checkout);

export default Checkout;

module.exports = Checkout;
