import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import Dropdown from '../UI/Dropdown';
import Button from '../UI/Button';
import Card from '../UI/Card';
import LoadingIndicator from '../UI/LoadingIndicator';
import Paragraph from '../UI/Paragraph';
import Label from '../UI/Label';
import {getMessages} from '../../actions/messages/index';
import units from '../../components/styles/units';
import fonts from '../styles/fonts';
import colors from '../styles/colors';

class Inbox extends Component {
  state = {
    inbox: [],
    status: 'unread',
  };

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
    this.setState({status: status, isLoading: true});

    // set initial conversations
    let conversations = [];

    // iterate through conversations
    this.props.conversations.forEach(async (conversation, index) => {
      // set opened status
      const openedStatus = status === 'unread' ? '&opened=false' : '';

      // set conversation users
      const users =
        status === 'unread' ? `&receiver=${this.props.user._id}` : '';

      // get messages for conversation
      const messages = await this.props.getMessages(
        `conversation_id=${conversation._id}${users}${openedStatus}`,
      );

      // if messages, add messages to conversations
      if (messages.length > 0) conversations.push(messages);

      // if last iteration of loop, set inbox
      if (index === this.props.conversations.length - 1)
        this.setState({inbox: conversations});
    });

    // hide loading indicator
    this.setState({isLoading: false});
  }

  render() {
    const {status, inbox, isLoading} = this.state;

    const {onSelectConversation} = this.props;

    return (
      <View>
        {/* loading indicator start */}
        <LoadingIndicator loading={isLoading} />

        {/* status filter */}
        <Dropdown
          label="Filter"
          value={status}
          onChange={value => this.setStatus(value)}
          options={[
            {
              label: 'Unread',
              value: 'unread',
            },
            {
              label: 'All Messages',
              value: 'all messages',
            },
          ]}
        />

        {/* inbox messages */}
        {inbox.map((conversation, index) => {
          const lastIndex = conversation.length - 1;
          const latestMessage = conversation[lastIndex];
          return (
            <View key={index}>
              <Card
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: units.unit3,
                }}>
                <View>
                  <Text
                    style={{
                      textTransform: 'capitalize',
                      fontSize: fonts.h3,
                      color: colors.greenD90,
                    }}>
                    {latestMessage.sender.first_name}{' '}
                    {latestMessage.sender.last_name[0]}.
                  </Text>
                  <Label>
                    {moment(latestMessage.dt_created).format('MM/DD/YYYY')}
                  </Label>
                </View>
                <View>
                  <Button
                    small
                    text="View Message"
                    onPress={() =>
                      onSelectConversation(latestMessage.conversation_id)
                    }
                    variant="btn3"
                  />
                </View>
              </Card>
            </View>
          );
        })}
        {inbox.length < 1 && (
          <View style={{marginBottom: units.unit5}}>
            <Paragraph
              style={{
                fontWeight: 'bold',
                marginTop: units.unit5,
                textAlign: 'center',
              }}>
              No messages found
            </Paragraph>
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
    },
    dispatch,
  );
}

Inbox = connect(mapStateToProps, mapDispatchToProps)(Inbox);

export default Inbox;

module.exports = Inbox;
