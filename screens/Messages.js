
import React, { Component } from 'react';
import { Text, SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Inbox from '../components/app/Inbox';

class Messages extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <ScrollView>
                    <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25, marginBottom: 25 }}>Messages</Text>
                    <View style={{ padding: 12 }}>

                        {/* inbox */}
                        <Inbox
                            onSelectConversation={(conversationId) => this.props.navigation.navigate('Message', { conversationId: conversationId })}
                        />

                    </View>
                </ScrollView>
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

Messages = connect(mapStateToProps, null)(Messages);

export default Messages;

module.exports = Messages;