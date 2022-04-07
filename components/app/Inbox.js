
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Dropdown from '../UI/Dropdown';
import Divider from '../UI/Divider';
import Button from '../UI/Button';
import LoadingIndicator from '../UI/LoadingIndicator';
import Paragraph from '../UI/Paragraph';
import { getMessages } from '../../actions/messages/index';
import units from '../../components/styles/units';

class Inbox extends Component {

    state = {
        inbox: [],
        status: 'unread'
    }

    componentDidMount() {
        // set initial status to "unread"
        this.setStatus('unread');
    }

    componentDidUpdate(prevProps) {
        if (prevProps.conversations !== this.props.conversations) {
            this.setStatus(this.state.status);
        }
    }

    setStatus(status) {
        // set status and show loading indicator
        this.setState({ status: status, isLoading: true });

        // set initial conversations
        let conversations = [];

        // iterate through conversations
        this.props.conversations.forEach(async (conversation, index) => {

            // set opened status
            const openedStatus = (status === 'unread') ? '&opened=false' : '';

            // set conversation users
            const users = (status === 'unread') ? `&receiver=${this.props.user._id}` : '';

            // get messages for conversation
            const messages = await this.props.getMessages(`conversation_id=${conversation._id}${users}${openedStatus}`);

            // if messages, add messages to conversations
            if (messages.length > 0) conversations.push(messages);

            // if last iteration of loop, set inbox
            if (index === this.props.conversations.length - 1) this.setState({ inbox: conversations });
        })

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    render() {

        const {
            status,
            inbox,
            isLoading
        } = this.state;

        const {
            onSelectConversation
        } = this.props;

        return (
            <View>
                {/* loading indicator start */}
                <LoadingIndicator
                    loading={isLoading}
                />

                {/* status filter */}
                <View style={{ backgroundColor: '#fff', padding: units.unit5, borderRadius: 5, marginBottom: units.unit5 }}>
                    <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Filter</Paragraph>
                    <Dropdown
                        value={status}
                        onChange={(value) => this.setStatus(value)}
                        options={[
                            {
                                label: 'Unread',
                                value: 'unread',
                            },
                            {
                                label: 'All Messages',
                                value: 'all messages',
                            }
                        ]}
                    />
                </View>

                {/* inbox messages */}
                {inbox.map((conversation, index) => {
                    const lastIndex = (conversation.length - 1);
                    const latestMessage = conversation[lastIndex];
                    return (
                        <View style={{ backgroundColor: '#fff', padding: units.unit5, borderRadius: 5 }} key={index}>
                            <View style={{ marginBottom: units.unit5 }}>
                                <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>From</Paragraph>
                                <Paragraph>{latestMessage.sender.first_name} {latestMessage.sender.last_name[0]}.</Paragraph>
                                <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Date</Paragraph>
                                <Paragraph>{moment(latestMessage.dt_created).format('MM/DD/YYYY')}</Paragraph>
                            </View>
                            <Divider />
                            <View>
                                <Button
                                    text="View Message"
                                    onPress={() => onSelectConversation(latestMessage.conversation_id)}
                                    variant="secondary"
                                />
                            </View>
                        </View>
                    )
                })}
                {(inbox.length < 1) && (
                    <View style={{ marginBottom: units.unit5 }}>
                        <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5, textAlign: 'center' }}>No messages found</Paragraph>
                    </View>
                )}
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        conversations: state.conversations,
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getMessages
    }, dispatch)
}

Inbox = connect(mapStateToProps, mapDispatchToProps)(Inbox);

export default Inbox;

module.exports = Inbox;