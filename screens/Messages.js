
import React, { Component } from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Inbox from '../components/app/Inbox';
import { getConversations } from '../actions/conversations/index';

class Messages extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25 }}>Messages</Text>
                <View style={{ padding: 12 }}>

                    {/* inbox */}
                    <Inbox 
                        onSelectConversation={(conversationId) => this.props.navigation.navigate('Message', {conversationId: conversationId})}
                    />
                    
                </View>
            </SafeAreaView>
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
        getConversations
    }, dispatch)
}

Messages = connect(mapStateToProps, mapDispatchToProps)(Messages);

export default Messages;

module.exports = Messages;