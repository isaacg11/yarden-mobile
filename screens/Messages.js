
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Inbox from '../components/app/Inbox';
import Header from '../components/UI/Header';
import units from '../components/styles/units';

class Messages extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <ScrollView>
                    <Header type="h4" style={{ textAlign: 'center', marginTop: units.unit6 }}>
                        Messages
                    </Header>
                    <View style={{ padding: units.unit5 }}>

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