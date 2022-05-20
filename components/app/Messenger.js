import React, {Component} from 'react';
import {View, ScrollView, Image, TouchableOpacity, Text} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import {launchImageLibrary} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageDetails from '../app/ImageDetails';
import Input from '../UI/Input';
import Button from '../UI/Button';
import LoadingIndicator from '../UI/LoadingIndicator';
import Paragraph from '../UI/Paragraph';
import Divider from '../UI/Divider';
import Label from '../UI/Label';
import {alert} from '../../components/UI/SystemAlert';
import {
  createMessage,
  getMessages,
  updateMessage,
} from '../../actions/messages/index';
import {getConversations} from '../../actions/conversations/index';
import uploadImage from '../../helpers/uploadImage';
import units from '../../components/styles/units';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

class Messenger extends Component {
  state = {
    contacts: [{label: 'No Contacts', value: 'No Contacts'}],
    attachments: [],
  };

  async componentDidMount() {
    // if current conversation {...}
    if (this.props.conversationId) {
      // get messages for conversation
      const messages = await this.props.getMessages(
        `conversation_id=${this.props.conversationId}`,
      );

      let openedNewMessage = false;

      // iterate through messages
      messages.forEach(async (message, index) => {
        // if message is unread for current logged in user {...}
        if (message.receiver._id === this.props.user._id && !message.opened) {
          // update message as read
          await this.props.updateMessage(message._id, {opened: true});
          openedNewMessage = true;
        }

        // if last iteration of loop and a new message was opened {...}
        if (index === messages.length - 1 && openedNewMessage) {
          // get conversations (this will update the inbox UI)
          await this.props.getConversations(`users=${this.props.user._id}`);
        }
      });

      // set other participant for conversation
      let participant = null;

      // iterate through messages {...}
      messages.forEach(message => {
        // if message sender is not current logged in user {...}
        if (message.sender._id !== this.props.user._id) {
          // set participant using sender
          participant = message.sender;
        } else {
          // set participant using receiver
          participant = message.receiver;
        }
      });

      // set receiver
      const receiver = `${participant.first_name} ${participant.last_name}`;

      // set contacts
      const contacts = [{label: receiver, value: receiver}];

      // update UI
      this.setState({
        receiver: receiver,
        contacts: contacts,
        conversation: messages,
      });
    } else {
      // set contacts
      this.setContacts();
    }
  }

  setValue(receiver) {
    const selectedOption =
      receiver !== 'Contacts' ? receiver : this.state.receiver;
    this.setState({receiver: selectedOption});
  }

  async setContacts() {
    // if no conversations {...}
    if (this.props.conversations.length < 1) {
      // render no contacts
      this.setState({receiver: 'No Contacts'});
    } else {
      // set initial value
      let contacts = [];

      // iterate through conversations
      this.props.conversations.forEach((conversation, index) => {
        // iterate through users for each conversation
        conversation.users.forEach(user => {
          // if not logged in user, add to contacts list
          if (user._id !== this.props.user._id)
            contacts.push({
              label: `${user.first_name} ${user.last_name}`,
              value: `${user.first_name} ${user.last_name}`,
              key: index,
            });
        });
      });

      // set default receiver
      contacts.unshift({label: 'Contacts', value: 'Contacts'});

      // set contacts
      this.setState({
        contacts: contacts,
        receiver: 'Contacts',
      });
    }
  }

  async sendMessage() {

    // if no text provided {...}
    if(!this.state.message) {

      // render error
      return alert('Your message has no text');
    }

    // show loading indicator
    this.setState({isLoading: true});

    // set intitial attachment value
    let attachments = [];

    // if attachments {...}
    if (this.state.attachments.length > 0) {
      // iterate through attachments
      this.state.attachments.forEach(async (attachment, index) => {
        // upload image to S3
        const attachmentImage = await uploadImage(
          attachment.uri,
          'attachment.jpg',
          'jpg',
        );

        // add saved image to attachments list for message
        attachments.push({
          url: attachmentImage,
          size: attachment.fileSize,
          mimetype: attachment.type,
          filename: attachment.fileName,
        });

        // if last iteration of the loop {...}
        if (index === this.state.attachments.length - 1) {
          // finish sending message
          this.finish(attachments);
        }
      });
    } else {
      // finish sending message
      this.finish();
    }
  }

  async finish(attachments) {
    // set conversation id
    const conversationId = this.props.conversationId;

    // set message receiver
    const receiver = this.state.conversation[0].sender._id;

    // set message sender
    const sender = this.props.user._id;

    const attachmentsList = attachments ? attachments : [];

    // format message data
    const message = {
      sender: sender,
      receiver: receiver,
      text: this.state.message,
      conversation_id: conversationId,
      attachments: attachmentsList,
    };

    // create new message
    await this.props.createMessage(message);

    // get messages for conversation
    const messages = await this.props.getMessages(
      `conversation_id=${this.props.conversationId}`,
    );

    // update UI
    this.setState({
      conversation: messages,
      message: '',
      attachments: [],
      isLoading: false,
    });
  }

  attachFile() {
    // open image gallery
    launchImageLibrary(
      {
        selectionLimit: 0,
        maxWidth: 500,
        maxHeight: 500,
        quality: 1,
      },
      res => {
        // if user selected an image {...}
        if (!res.didCancel) {
          // update UI
          this.setState({
            attachments: res.assets,
          });
        }
      },
    );
  }

  render() {
    const {
      message,
      receiver,
      isLoading,
      conversation,
      attachments,
      isOpen,
      imageUrl,
    } = this.state;

    const {user} = this.props;

    return (
      <View
        style={{
          flexGrow: 1,
          justifyContent: 'space-between',
          alignItems: 'stretch',
        }}>
        {/* loading indicator */}
        <LoadingIndicator loading={isLoading} />

        {/* image details modal */}
        <ImageDetails
          isOpen={isOpen}
          url={imageUrl}
          close={() => this.setState({isOpen: false, imageUrl: null})}
        />

        <View style={{flex: 1}}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: units.unit3,
              shadowColor: colors.greenC10,
              shadowOffset: {
                width: 0,
                height: 8,
              },
              shadowOpacity: 1,
              shadowRadius: 8,
            }}>
            <Label>To: </Label>
            <Text style={{textTransform: 'capitalize'}}>{receiver}</Text>
          </View>
          <Divider />

          <View
            style={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            {/* conversation thread */}
            <View
              style={{
                height: 560,
                display: 'flex',
              }}>
              <ScrollView
                style={{
                  paddingHorizontal: units.unit3 + units.unit4,
                }}
                ref={ref => {
                  this.scrollView = ref;
                }}
                onContentSizeChange={() =>
                  this.scrollView.scrollToEnd({animated: false})
                }>
                {conversation &&
                  conversation.map((message, index) => (
                    <View style={{flexDirection: 'row'}} key={index}>
                      <View
                        style={{
                          flex: message.sender._id !== user._id ? 1 : 0,
                        }}></View>
                      <View style={{flex: 2}}>
                        <View style={{marginVertical: units.unit3}}>
                          <View
                            style={{
                              paddingVertical: units.unit3,
                              paddingHorizontal: units.unit4,
                              borderRadius: units.unit3,
                              backgroundColor:
                                message.sender._id !== user._id
                                  ? colors.greenB
                                  : '#ffffff',
                              shadowColor:
                                message.sender._id !== user._id
                                  ? colors.greenB25
                                  : colors.greenC10,
                              shadowOffset: {
                                width: 0,
                                height: 8,
                              },
                              shadowOpacity: 1,
                              shadowRadius: 8,
                            }}>
                            <Text
                              style={{
                                lineHeight: fonts.h3,
                                fontSize: fonts.h4,
                                width: '100%',
                                color:
                                  message.sender._id !== user._id
                                    ? '#ffffff'
                                    : colors.greenD90,
                              }}>
                              {message.text}
                            </Text>
                            {message.attachments.length > 0 &&
                              message.attachments.map((attachment, i) => (
                                <View key={i} style={{marginTop: units.unit3}}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.setState({
                                        imageUrl: attachment.url,
                                        isOpen: true,
                                      })
                                    }>
                                    <Image
                                      style={{width: '100%', height: 100}}
                                      source={{uri: attachment.url}}
                                      alt="message attachment"
                                    />
                                  </TouchableOpacity>
                                </View>
                              ))}
                          </View>
                          <View
                            style={{
                              marginTop: units.unit2,
                            }}>
                            <Paragraph
                              style={{
                                fontSize: fonts.h5,
                                textAlign:
                                  message.sender._id !== user._id
                                    ? 'right'
                                    : 'left',
                                color: colors.greenE25,
                              }}>
                              {moment(message.dt_created).format('MM/DD/YYYY')}{' '}
                              {message.receiver._id !== user._id
                                ? message.opened
                                  ? '• Read'
                                  : '• Sent'
                                : ''}
                            </Paragraph>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          flex: message.sender._id !== user._id ? 0 : 1,
                        }}></View>
                    </View>
                  ))}
              </ScrollView>
              <Divider />
            </View>

            <View style={{paddingHorizontal: units.unit3 + units.unit4}}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{flexGrow: 1}}>
                  <Input
                    onChange={value => this.setState({message: value})}
                    value={message}
                    placeholder="Enter message..."
                    style={{maxWidth: `${100 - units.unit2}%`}}
                  />
                </View>
                <Ionicons
                  name={'send'}
                  onPress={() => this.sendMessage()}
                  color={colors.purpleB}
                  size={24}
                />
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Button
                  small
                  variant="btn3"
                  text="Attach Files"
                  icon={
                    <Ionicons
                      name={'attach'}
                      color={colors.purpleB}
                      size={fonts.h3}
                    />
                  }
                  onPress={() => this.attachFile()}
                />
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Label>Attachments ({attachments.length}) </Label>
                  <Ionicons
                    name={'trash'}
                    color={
                      this.state.attachments.length > 0
                        ? colors.purpleB
                        : colors.greenD75
                    }
                    size={fonts.h4}
                    onPress={() => this.setState({attachments: []})}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    conversations: state.conversations,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createMessage,
      getMessages,
      updateMessage,
      getConversations,
    },
    dispatch,
  );
}

Messenger = connect(mapStateToProps, mapDispatchToProps)(Messenger);

export default Messenger;

module.exports = Messenger;
