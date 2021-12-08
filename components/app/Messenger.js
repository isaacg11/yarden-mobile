
import React, { Component } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageDetails from '../app/ImageDetails';
import Dropdown from '../UI/Dropdown';
import Input from '../UI/Input';
import Button from '../UI/Button';
import LoadingIndicator from '../UI/LoadingIndicator';
import Divider from '../UI/Divider';
import Link from '../UI/Link';
import { createMessage, getMessages, updateMessage } from '../../actions/messages/index';
import { getConversations } from '../../actions/conversations/index';
import uploadImage from '../../helpers/uploadImage';

class Messenger extends Component {

    state = {
        contacts: [{ label: 'No Contacts', value: 'No Contacts' }],
        attachments: []
    }

    async componentDidMount() {

        // if current conversation {...}
        if (this.props.conversationId) {

            // get messages for conversation
            const messages = await this.props.getMessages(`conversation_id=${this.props.conversationId}`);

            let openedNewMessage = false;

            // iterate through messages
            messages.forEach(async (message, index) => {

                // if message is unread for current logged in user {...}
                if (message.receiver._id === this.props.user._id && !message.opened) {

                    // update message as read
                    await this.props.updateMessage(message._id, { opened: true });
                    openedNewMessage = true;
                }

                // if last iteration of loop and a new message was opened {...}
                if((index === messages.length - 1) && openedNewMessage) {

                    // get conversations (this will update the inbox UI)
                    await this.props.getConversations(`users=${this.props.user._id}`);
                }
            })

            // set receiver
            const receiver = `${messages[0].sender.first_name} ${messages[0].sender.last_name}`;

            // set contacts
            const contacts = [{ label: receiver, value: receiver }];

            // update UI
            this.setState({
                receiver: receiver,
                contacts: contacts,
                conversation: messages
            });
        } else {
            // set contacts
            this.setContacts();
        }
    }

    setValue(receiver) {
        const selectedOption = (receiver !== 'Contacts') ? receiver : this.state.receiver;
        this.setState({ receiver: selectedOption });
    }

    async setContacts() {

        // if no conversations {...}
        if (this.props.conversations.length < 1) {

            // render no contacts
            this.setState({ receiver: 'No Contacts' })
        } else {

            // set initial value
            let contacts = [];

            // iterate through conversations
            this.props.conversations.forEach((conversation, index) => {

                // iterate through users for each conversation
                conversation.users.forEach((user) => {

                    // if not logged in user, add to contacts list
                    if (user._id !== this.props.user._id) contacts.push({
                        label: `${user.first_name} ${user.last_name}`,
                        value: `${user.first_name} ${user.last_name}`,
                        key: index
                    });
                })
            })

            // set default receiver
            contacts.unshift({ label: 'Contacts', value: 'Contacts' });

            // set contacts
            this.setState({
                contacts: contacts,
                receiver: 'Contacts'
            })
        }
    }

    async sendMessage() {

        // show loading indicator
        this.setState({ isLoading: true });

        // set intitial attachment value
        let attachments = [];

        // if attachments {...}
        if (this.state.attachments.length > 0) {

            // iterate through attachments
            this.state.attachments.forEach(async (attachment, index) => {

                // upload image to S3
                const attachmentImage = await uploadImage(attachment.uri, 'attachment.jpg', 'jpg');

                // add saved image to attachments list for message
                attachments.push({
                    url: attachmentImage,
                    size: attachment.fileSize,
                    mimetype: attachment.type,
                    filename: attachment.fileName
                });

                // if last iteration of the loop {...}
                if (index === this.state.attachments.length - 1) {

                    // finish sending message
                    this.finish(attachments);
                }
            })
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

        const attachmentsList = (attachments) ? attachments : []

        // format message data
        const message = {
            sender: sender,
            receiver: receiver,
            text: this.state.message,
            conversation_id: conversationId,
            attachments: attachmentsList
        }

        // create new message
        await this.props.createMessage(message);

        // get messages for conversation
        const messages = await this.props.getMessages(`conversation_id=${this.props.conversationId}`);

        // update UI
        this.setState({
            conversation: messages,
            message: '',
            attachments: [],
            isLoading: false
        });
    }

    attachFile() {

        // open image gallery
        launchImageLibrary({ 
            selectionLimit: 0,
            maxWidth: 500,
            maxHeight: 500,
            quality: 1
        }, (res) => {
            // if user selected an image {...}
            if (!res.didCancel) {

                // update UI
                this.setState({
                    attachments: res.assets
                })
            }
        })
    }

    render() {

        const {
            message,
            contacts,
            receiver,
            isLoading,
            conversation,
            attachments,
            isOpen,
            imageUrl
        } = this.state;

        const {
            user
        } = this.props;

        return (
            <View>
                {/* loading indicator */}
                <LoadingIndicator
                    loading={isLoading}
                />

                {/* image details modal */}
                <ImageDetails
                    isOpen={isOpen}
                    url={imageUrl}
                    close={() => this.setState({ isOpen: false, imageUrl: null })}
                />

                <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                    <View style={{ marginBottom: 12 }}>

                        {/* message receiver dropdown */}
                        <Text style={{ fontWeight: 'bold', marginTop: 12 }}>To</Text>
                        <Dropdown
                            disabled={true}
                            value={receiver}
                            options={contacts}
                            onChange={(value) => {
                                this.setValue(value);
                            }}
                        />

                        {/* conversation thread */}
                        <Text style={{ fontWeight: 'bold', marginTop: 12, marginBottom: 12 }}>Conversation</Text>
                        <View style={{ backgroundColor: '#F7F7F7', height: 200, borderWidth: 1, padding: 12, display: 'flex' }}>
                            <ScrollView
                                ref={ref => { this.scrollView = ref }}
                                onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: false })}>
                                {conversation && conversation.map((message, index) => (
                                    <View style={{ flexDirection: 'row' }} key={index}>
                                        <View style={{ flex: (message.sender._id !== user._id) ? 1 : 0 }}></View>
                                        <View style={{ flex: 1 }}>
                                            <View>
                                                <View style={{
                                                    padding: 15,
                                                    borderRadius: 5,
                                                    backgroundColor: (message.sender._id !== user._id) ? '#4d991a' : '#ffffff'
                                                }}>
                                                    <Text style={{ color: (message.sender._id !== user._id) ? '#ffffff' : '#000000' }}>
                                                        {message.text}
                                                    </Text>
                                                    {(message.attachments.length > 0) && message.attachments.map((attachment, i) => (
                                                        <View key={i} style={{ marginTop: 12 }}>
                                                            <TouchableOpacity onPress={() => this.setState({
                                                                imageUrl: attachment.url,
                                                                isOpen: true
                                                            })}>
                                                                <Image
                                                                    style={{ width: '100%', height: 100 }}
                                                                    source={{ uri: attachment.url }}
                                                                    alt="message attachment"

                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                    ))}
                                                </View>
                                                <View style={{ marginBottom: 15, marginTop: 5 }}>
                                                    <Text style={{ fontSize: 10 }}>{moment(message.dt_created).format('MM/DD/YYYY')} {(message.receiver._id !== user._id) ? (message.opened) ? '• Read' : '• Sent' : ''}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flex: (message.sender._id !== user._id) ? 0 : 1 }}></View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>

                        {/* message input */}
                        <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Message</Text>
                        <Input
                            onChange={(value) => this.setState({ message: value })}
                            value={message}
                            multiline={true}
                            numberOfLines={2}
                            placeholder="Enter message here..."
                        />

                        {/* attachments */}
                        <View>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                <Text>Attachments ({attachments.length})</Text>
                                <Link text="Delete" onPress={() => this.setState({ attachments: [] })}></Link>
                            </View>
                            <Divider />
                        </View>

                        {/* buttons */}
                        <View>
                            <Button
                                text="Attach Files"
                                icon={<Ionicons name={'attach'} size={30} />}
                                onPress={() => this.attachFile()}
                                variant="secondary"
                            />

                            <Button
                                text="Send"
                                disabled={!message}
                                onPress={() => this.sendMessage()}
                                variant="primary"
                            />
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        conversations: state.conversations
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        createMessage,
        getMessages,
        updateMessage,
        getConversations
    }, dispatch)
}

Messenger = connect(mapStateToProps, mapDispatchToProps)(Messenger);

export default Messenger;

module.exports = Messenger;