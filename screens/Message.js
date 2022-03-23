
import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import Messenger from '../components/app/Messenger';
import Paragraph from '../components/UI/Paragraph';

class Message extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <Paragraph style={{ fontSize: 25, textAlign: 'center', marginTop: 25, marginBottom: 25 }}>Messenger</Paragraph>
                <View style={{ padding: 12 }}>

                    {/* messenger */}
                    <Messenger 
                        conversationId={this.props.route.params.conversationId}
                    />

                </View>

            </SafeAreaView>
        )
    }
}

module.exports = Message;