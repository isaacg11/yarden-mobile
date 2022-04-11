
import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import Paragraph from '../components/UI/Paragraph';
import Header from '../components/UI/Header';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Card from '../components/UI/Card';
import { updateOrder, getOrders } from '../actions/orders/index';
import { getConversations, createConversation } from '../actions/conversations/index';
import { createMessage } from '../actions/messages/index';
import { sendEmail } from '../actions/emails/index';
import { sendSms } from '../actions/sms/index';
import formatAddress from '../helpers/formatAddress';
import config from '../config/index';
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class RequestQuoteChange extends Component {

    state = {
        message: null
    }

    async submit() {

        // show loading indicator
        this.setState({ isLoading: true });

        // set quote
        const quote = this.props.route.params.quote;

        // set message text
        const systemMessage = `QUOTE: "${quote.title} - ${quote.description}"`;
        const userMessage = `MESSAGE FROM CUSTOMER: "${this.state.message}"`;

        // if quote has a vendor assigned to it {...}
        if (quote && quote.vendor) {

            // format message
            let message = {
                sender: this.props.user._id,
                receiver: quote.vendor._id,
                text: `One of your quotes has received a change request.\n\n${systemMessage}\n\n${userMessage}`,
                attachments: []
            }

            // look for current conversation between vendor and customer
            const conversations = await this.props.getConversations(`users=${quote.vendor._id},${this.props.user._id}`, true);

            // if a conversation already exists {...}
            if (conversations.length > 0) {

                // set conversation id
                message.conversation_id = conversations[0]._id;

                // create new message
                await this.props.createMessage(message);

                // finish submission
                this.finish(message, quote);
            } else {
                // format conversation
                const conversation = { users: [quote.vendor._id, this.props.user._id] };

                // create new conversation
                const newConversation = await this.props.createConversation(conversation);

                // set conversation id
                message.conversation_id = newConversation._id;

                // create new message
                await this.props.createMessage(message);

                // finish submission
                this.finish(message, quote);
            }
        } else {
            // finish submission
            this.finish({ text: `${systemMessage}\n\n${userMessage}` }, quote);
        }
    }

    async finish(message, quote) {

        // get conversations
        await this.props.getConversations(`users=${this.props.user._id}`);

        // set intial email value
        let email = null;

        // set intial greeting value
        let greeting = null;

        // set intial message context value
        let context = null;

        // set initial text value
        let text = this.state.message;

        // set address
        const address = formatAddress(quote.customer);

        // if vendor {...}
        if (quote.vendor) {

            // configure message for vendor
            greeting = `Greetings from Yarden!`;
            email = quote.vendor.email;
            context = 'One of your quotes has received a change request. Please review the request and update the quote accordingly.';
        } else {

            // configure message for Yarden HQ
            greeting = `Hello <b>Yarden HQ</b>,`;
            email = config.email;
            context = 'A customer has submitted a quote change request, but there is no vendor assigned to the quote. Please assign a vendor to the quote so the change can be completed.';
        }

        // format email notification
        const notification = {
            email: email,
            subject: `Yarden - (ACTION REQUIRED) New quote change request`,
            label: 'Quote Changes Requested',
            body: (
                '<p>' + greeting + '</p>' +
                '<p>' + context + '</p>' +
                '<p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #DDDDDD;"><b>CUSTOMER</b></p>' +
                '<p>' + quote.customer.first_name + ' ' + quote.customer.last_name + '</p>' +
                '<p>' + address + '</p>' +
                '<p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #DDDDDD;"><b>QUOTE</b></p>' +
                '<p>' + quote.title + ' - ' + quote.description + '</p>' +
                '<p style="margin-top: 5px; padding-top: 15px; border-top: 1px solid #DDDDDD;"><b>MESSAGE</b></p>' +
                '<p>' + text + '</p>'
            )
        }

        // send email notification
        await this.props.sendEmail(notification);

        // if vendor is assigned to quote {...}
        if (quote.vendor) {

            // format sms message
            const sms = {
                from: config.phoneNumber,
                to: quote.vendor.phone_number.replace(/\D/g, ''),
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
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                {/* loading indicator start */}
                <LoadingIndicator
                    loading={isLoading}
                />
                {/* loading indicator end */}

                {/* change request form start */}
                <Header type="h4" style={{ textAlign: 'center', marginTop: units.unit6 }}>Request Changes</Header>
                <View style={{ padding: units.unit5 }}>
                    <Card>
                        <View>
                            <Paragraph>Please describe the changes you'd like made to your quote</Paragraph>
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

            </SafeAreaView>
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
        getConversations
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        user: state.user,
        conversations: state.conversations
    }
}

RequestQuoteChange = connect(mapStateToProps, mapDispatchToProps)(RequestQuoteChange);

export default RequestQuoteChange;

module.exports = RequestQuoteChange;