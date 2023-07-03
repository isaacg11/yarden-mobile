// libraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

// UI components
import Button from '../UI/Button';
import LoadingIndicator from '../UI/LoadingIndicator';
import Paragraph from '../UI/Paragraph';
import Label from '../UI/Label';
import Divider from '../UI/Divider';

// actions
import { getMessages, createMessage } from '../../actions/messages/index';
import { getOrders } from '../../actions/orders/index';
import { createConversation } from '../../actions/conversations/index';

// helpers
import capitalize from '../../helpers/capitalize';
import truncate from '../../helpers/truncate';

// styles
import units from '../../components/styles/units';
import fonts from '../styles/fonts';
import colors from '../styles/colors';

// types
import types from '../../vars/types';

class Inbox extends Component {
  state = {
    inbox: []
  };

  async componentDidMount() {

    if (this.props.conversations.length > 0) {
      // set inbox
      await this.setInbox();
    }

    // if customer and there is no conversations {...}
    if (this.props.user.type === types.CUSTOMER && this.state.inbox.length < 1) {

      // get pending orders
      const pendingOrders = await this.props.getOrders(
        `status=pending`,
        true
      );

      // get maintenance order
      const maintenanceOrder = pendingOrders.list.find((order) => order.type === types.FULL_PLAN || order.type === types.ASSISTED_PLAN);
      if (maintenanceOrder) {
        // update UI
        this.setState({ gardener: maintenanceOrder.vendor });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.conversations !== this.props.conversations) {
      this.setInbox();
    }
  }

  async setInbox() {
    
    // show loading indicator
    this.setState({ isLoading: true });

    let getConversations = [];

    // iterate through conversations
    this.props.conversations.forEach((conversation) => {

      getConversations.push(
        new Promise(async resolve => {

          // get messages for conversation
          const messages = await this.props.getMessages(
            `conversation_id=${conversation._id}`,
          );

          resolve(messages);
        }),
      );
    });

    // get conversations
    Promise.all(getConversations).then(async (conversations) => {

      // hide loading indicator
      this.setState({ 
        inbox: conversations,
        isLoading: false 
      });
    });
  }

  async startConversation() {

    // show loading indicator
    this.setState({ isLoading: true });

    // format conversation
    const conversation = { users: [this.state.gardener._id, this.props.user._id] };

    // create new conversation
    const newConversation = await this.props.createConversation(conversation);

    // format first message
    const message = {
      conversation_id: newConversation._id,
      sender: this.state.gardener._id,
      receiver: this.props.user._id,
      text: `Hello ${capitalize(this.props.user.first_name)}! My name is ${capitalize(this.state.gardener.first_name)}, and I've been assigned as your gardener. Feel free to ask me anything!`,
      attachments: []
    }

    // create new message
    await this.props.createMessage(message);

    // hide loading indicator
    this.setState({ isLoading: false });

    // navigate to new conversation
    this.props.onSelectConversation(newConversation._id);
  }

  render() {
    const {
      inbox,
      isLoading,
      gardener
    } = this.state;

    const {
      onSelectConversation,
      user
    } = this.props;

    return (
      <View>
        {/* loading indicator start */}
        <LoadingIndicator loading={isLoading} />

        {/* inbox messages */}
        {inbox.map((conversation, index) => {
          const lastIndex = conversation.length - 1;
          const latestMessage = conversation[lastIndex];
          let correspondant = null;

          conversation.forEach((message) => {
            if (message.sender._id !== this.props.user._id) {
              correspondant = message.sender;
            } else if (message.receiver._id !== this.props.user._id) {
              correspondant = message.receiver;
            }
          })

          return (
            <View key={index}>
              <TouchableOpacity
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: units.unit3,
                }}
                onPress={() =>
                  onSelectConversation(latestMessage.conversation_id)
                }>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ marginRight: units.unit3 }}>
                    <Image
                      source={{ uri: (correspondant.profile_image) ? correspondant.profile_image : 'https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/profile-avatar.png' }}
                      style={{
                        width: units.unit5 + units.unit2,
                        height: units.unit5 + units.unit2,
                        borderRadius: (units.unit5 + units.unit2 / 2)
                      }}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        textTransform: 'capitalize',
                        fontSize: fonts.h3,
                        color: colors.greenD90,
                        marginBottom: units.unit2
                      }}>
                      {correspondant.first_name}{' '}
                      {correspondant.last_name[0]}.{' '}
                      ({capitalize(correspondant.type)})
                    </Text>
                    <Label>
                      {truncate(latestMessage.text, 20)}
                    </Label>
                  </View>
                </View>
                <View>
                  <Label>{moment(latestMessage.dt_created).format('MM/DD/YYYY')}</Label>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <></>
                    <Ionicons
                      name="chevron-forward-outline"
                      size={fonts.h2}
                      color={colors.purpleB}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <Divider style={{ marginTop: units.unit4 }} />
            </View>
          );
        })}
        {inbox.length < 1 && (
          <View style={{ marginBottom: units.unit5, marginTop: units.unit4 }}>
            <Paragraph
              style={{
                display: (user.type === types.CUSTOMER && gardener) ? 'none' : 'flex',
                fontWeight: 'bold',
                marginTop: units.unit3,
                textAlign: 'center',
              }}>
              No messages found
            </Paragraph>
            {gardener && (
              <View>
                <Text style={{ color: colors.greenD50 }}>You don't have any messages yet. If you have a question or comment you can reach out to your gardener directly.</Text>
                <Button
                  style={{ marginTop: units.unit4 }}
                  text="Talk to My Gardener"
                  onPress={() => this.startConversation()}
                />
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    conversations: state.conversations,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getMessages,
      getOrders,
      createConversation,
      createMessage
    },
    dispatch,
  );
}

Inbox = connect(mapStateToProps, mapDispatchToProps)(Inbox);

export default Inbox;

module.exports = Inbox;
