
import React, { Component } from 'react';
import { SafeAreaView, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Paragraph from '../components/UI/Paragraph';
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import { updateOrder, getOrders } from '../actions/orders/index';
import { createChangeOrder } from '../actions/changeOrders/index';
import { getConversations, createConversation } from '../actions/conversations/index';
import { createMessage } from '../actions/messages/index';
import { sendEmail } from '../actions/emails/index';
import { sendSms } from '../actions/sms/index';
import formatAddress from '../helpers/formatAddress';
import config from '../config/index';
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class RequestOrderChange extends Component {

    state = {
        message: null
    }

    async submit() {

        // show loading indicator
        this.setState({ isLoading: true });

        // set order
        const order = this.props.route.params;

        // format change order
        const changeOrder = {
            order: order._id,
            status: 'change requested',
            description: this.state.message
        }

        // create change order
        await this.props.createChangeOrder(changeOrder);

        // set message text
        const systemMessage = `ORDER: "${order.type} - ${order.description}"`;
        const userMessage = `MESSAGE FROM CUSTOMER: "${this.state.message}"`;

        // if order has a vendor assigned to it {...}
        if (order && order.vendor) {

            // format message
            let message = {
                sender: this.props.user._id,
                receiver: order.vendor._id,
                text: `One of your orders has received a change request.\n\n${systemMessage}\n\n${userMessage}`,
                attachments: []
            }

            // look for current conversation between vendor and customer
            const conversations = await this.props.getConversations(`users=${order.vendor._id},${this.props.user._id}`, true);

            // if a conversation already exists {...}
            if (conversations.length > 0) {

                // set conversation id
                message.conversation_id = conversations[0]._id;

                // create new message
                await this.props.createMessage(message);

                // finish submission
                this.finish(message, order);
            } else {
                // format conversation
                const conversation = { users: [order.vendor._id, this.props.user._id] };

                // create new conversation
                const newConversation = await this.props.createConversation(conversation);

                // set conversation id
                message.conversation_id = newConversation._id;

                // create new message
                await this.props.createMessage(message);

                // finish submission
                this.finish(message, order);
            }
        } else {
            // finish submission
            this.finish({ text: `${systemMessage}\n\n${userMessage}` }, order);
        }
    }

    async finish(message, order) {

        // get conversations
        await this.props.getConversations(`users=${this.props.user._id}`);

        // set intial email value
        let email = null;

        // set intial greeting value
        let greeting = null;

        // set intial message context value
        let context = null;

        // set intial text value
        let text = this.state.message;

        // set address
        const address = formatAddress(order.customer);

        // if vendor {...}
        if (order.vendor) {

            // configure message for vendor
            greeting = `Greetings from Yarden!`;
            email = order.vendor.email;
            context = 'One of your orders has received a change request. Please review the request and process the change order accordingly.';
        } else {

            // configure message for Yarden HQ
            greeting = `Hello <b>Yarden HQ</b>,`;
            email = config.email;
            context = 'A customer has submitted a order change request, but there is no vendor assigned to the order. Please assign a vendor to the order so the change can be completed.';
        }

        // format email notification
        const notification = {
            email: email,
            subject: `Yarden - (ACTION REQUIRED) New order change request`,
            label: 'Order Changes Requested',
            body: (
                '<p>' + greeting + '</p>' +
                '<p>' + context + '</p>' +
                '<p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #DDDDDD;"><b>CUSTOMER</b></p>' +
                '<p>' + order.customer.first_name + ' ' + order.customer.last_name + '</p>' +
                '<p>' + address + '</p>' +
                '<p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #DDDDDD;"><b>QUOTE</b></p>' +
                '<p>' + order.type + ' - ' + order.description + '</p>' +
                '<p style="margin-top: 5px; padding-top: 15px; border-top: 1px solid #DDDDDD;"><b>MESSAGE</b></p>' +
                '<p>' + text + '</p>'
            )
        }

        // send email notification
        await this.props.sendEmail(notification);

        // if vendor is assigned to order {...}
        if (order.vendor) {

            // format sms message
            const sms = {
                from: config.phoneNumber,
                to: order.vendor.phone_number.replace(/\D/g, ''),
                body: `${greeting} ${context} ${message.text}`
            }

            // send sms notification to vendor
            await this.props.sendSms(sms);
        }

        // navigate to changes requested page
        this.props.navigation.navigate('Changes Requested');

        // hide loading indicator
        this.setState({ isLoading: false, message: null });
    }

    render() {

        const {
            isLoading,
            message
        } = this.state;

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={{
                    flex: 1,
                    width: "100%",
                }}>
                    <View style={{ padding: units.unit3 + units.unit4 }}>

                        {/* loading indicator start */}
                        <LoadingIndicator
                            loading={isLoading}
                        />
                        {/* loading indicator end */}

                        {/* change request form start */}
                        <Header type="h4" style={{ marginBottom: units.unit5 }}>Request Changes</Header>
                        <View>
                            <Card>
                                <View>
                                    <Paragraph>Please describe the changes you'd like made to your order</Paragraph>
                                </View>
                                <View>
                                    <Input
                                        onChange={(value) => this.setState({ message: value })}
                                        value={message}
                                        multiline={true}
                                        numberOfLines={3}
                                        placeholder="Enter message here..."
                                    />
                                </View>
                            </Card>
                            <View style={{ marginTop: units.unit4 }}>
                                <Button
                                    text="Submit"
                                    onPress={() => this.submit()}
                                    disabled={!message}
                                    icon={(
                                        <Ionicons
                                            name="checkmark"
                                            size={units.unit4}
                                            color={colors.purpleB}
                                        />
                                    )}
                                />
                            </View>
                        </View>
                        {/* change request form end */}

                    </View>

                </SafeAreaView>
            </TouchableWithoutFeedback>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateOrder,
        getOrders,
        getConversations,
        createConversation,
        createMessage,
        sendEmail,
        sendSms,
        createChangeOrder
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        user: state.user,
        conversations: state.conversations
    }
}

RequestOrderChange = connect(mapStateToProps, mapDispatchToProps)(RequestOrderChange);

export default RequestOrderChange;

module.exports = RequestOrderChange;